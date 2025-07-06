import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTrafficData } from '../hooks/useTrafficData';
import {
  DashboardHeader,
  StatsCards,
  TrafficChart,
  DataTable,
  AddEditModal,
  ChartControls
} from '../components/dashboard';
import type { TrafficData } from '../types/traffic';
import type { ChartView } from '../components/dashboard/ChartControls';

const Dashboard: React.FC = () => {
  const { themeClasses } = useTheme();
  const { 
    data, 
    filteredData, 
    stats, 
    filteredStats, 
    loading, 
    error, 
    dateFrom, 
    dateTo, 
    setDateFrom, 
    setDateTo, 
    clearDateFilter, 
    addEntry, 
    updateEntry, 
    deleteEntry 
  } = useTrafficData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<TrafficData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [chartView, setChartView] = useState<ChartView>('daily');

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: TrafficData) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this traffic entry?')) {
      try {
        await deleteEntry(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleModalSave = async (formData: { date: string; visits: number }) => {
    try {
      setModalLoading(true);
      if (editData?.id) {
        await updateEntry(editData.id, formData);
      } else {
        await addEntry(formData);
      }
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Use filtered stats for display, but show if filtering is active
  const displayStats = filteredStats || stats;
  const isFiltering = dateFrom || dateTo;

  const getChartTitle = () => {
    const viewLabels = {
      daily: 'Daily Traffic Analytics',
      weekly: 'Weekly Traffic Analytics',
      monthly: 'Monthly Traffic Analytics'
    };
    return viewLabels[chartView];
  };

  return (
    <div className={themeClasses.background}>
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Filter Status */}
        {isFiltering && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">
              📊 Showing filtered data ({filteredData.length} of {data.length} entries)
              {dateFrom && ` from ${new Date(dateFrom).toLocaleDateString()}`}
              {dateTo && ` to ${new Date(dateTo).toLocaleDateString()}`}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards stats={displayStats} loading={loading} />

        {/* Chart Section */}
        <div className={`${themeClasses.card} p-8 mb-8`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${themeClasses.title}`}>
              {getChartTitle()}
              {isFiltering && (
                <span className="text-sm font-normal text-blue-500 ml-2">(Filtered)</span>
              )}
            </h3>
          </div>
          <ChartControls 
            chartType={chartType} 
            chartView={chartView}
            onChartTypeChange={setChartType} 
            onChartViewChange={setChartView}
          />
          <TrafficChart 
            data={filteredData} 
            loading={loading} 
            chartType={chartType} 
            chartView={chartView}
          />
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredData}
          loading={loading}
          dateFrom={dateFrom}
          dateTo={dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          clearDateFilter={clearDateFilter}
          totalDataCount={data.length}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Modal */}
        <AddEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          editData={editData}
          loading={modalLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard; 