import React, { useState } from 'react';
import { Edit2, Trash2, Plus, ChevronUp, ChevronDown, Calendar, X, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';

interface DataTableProps {
  data: TrafficData[];
  loading: boolean;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  clearDateFilter: () => void;
  totalDataCount: number;
  onEdit: (item: TrafficData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

type SortField = 'date' | 'visits';
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  loading, 
  dateFrom, 
  dateTo, 
  setDateFrom, 
  setDateTo, 
  clearDateFilter, 
  totalDataCount,
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const { themeClasses } = useTheme();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleDateFromChange = (date: string) => {
    setDateFrom(date);
    setCurrentPage(1);
  };

  const handleDateToChange = (date: string) => {
    setDateTo(date);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    clearDateFilter();
    setCurrentPage(1);
  };

  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = sortField === 'date' ? new Date(a.date).getTime() : a.visits;
    const bValue = sortField === 'date' ? new Date(b.date).getTime() : b.visits;
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-black" /> : 
      <ChevronDown className="w-4 h-4 text-black" />;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the start or end
      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const isFiltering = dateFrom || dateTo;

  if (loading) {
    return (
      <div className={`${themeClasses.card} p-8`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.card} p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h3 className={`text-xl font-bold ${themeClasses.title}`}>Traffic Data</h3>
          {data.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${themeClasses.subtitle}`}>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={`px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-black focus:border-black ${themeClasses.card} border-gray-300`}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className={`text-sm ${themeClasses.subtitle}`}>entries</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleDateFilter}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm ${
              showDateFilter || isFiltering
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {isFiltering && (
              <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {data.length}/{totalDataCount}
              </span>
            )}
          </button>
          <button
            onClick={onAdd}
            className="bg-black hover:bg-gray-800 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
      </div>

      {/* Collapsible Date Range Filter */}
      {showDateFilter && (
        <div className={`mb-6 p-3 sm:p-4 rounded-lg border ${themeClasses.card} bg-gray-50 transition-all duration-200 ease-in-out`}>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 ${themeClasses.subtitle}`} />
              <span className={`text-sm font-medium ${themeClasses.subtitle}`}>Filter by date:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className={`text-sm ${themeClasses.subtitle}`}>From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className={`px-2 sm:px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black ${
                  themeClasses.card
                } border-gray-300`}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className={`text-sm ${themeClasses.subtitle}`}>To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className={`px-2 sm:px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black ${
                  themeClasses.card
                } border-gray-300`}
              />
            </div>
            
            {isFiltering && (
              <button
                onClick={handleClearFilter}
                className="flex items-center space-x-1 px-2 py-1 text-sm text-black hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
            
            {isFiltering && (
              <div className={`text-sm ${themeClasses.subtitle} ml-4`}>
                Showing {data.length} of {totalDataCount} entries
              </div>
            )}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className={themeClasses.subtitle}>
            {totalDataCount === 0 ? "No traffic data available" : "No data found for the selected date range"}
          </p>
          <p className={`${themeClasses.subtitle} text-sm mt-2`}>
            {totalDataCount === 0 
              ? "Click \"Add Entry\" to create your first traffic record"
              : "Try adjusting your date filter or clear the filter to see all data"
            }
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th 
                    className={`text-left py-3 px-4 font-medium ${themeClasses.title} cursor-pointer hover:bg-white/5 transition-colors`}
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th 
                    className={`text-left py-3 px-4 font-medium ${themeClasses.title} cursor-pointer hover:bg-white/5 transition-colors`}
                    onClick={() => handleSort('visits')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Visits</span>
                      <SortIcon field="visits" />
                    </div>
                  </th>
                  <th className={`text-right py-3 px-4 font-medium ${themeClasses.title}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-gray-200 hover:bg-white/5 transition-colors"
                  >
                    <td className={`py-3 px-4 ${themeClasses.cardText}`}>
                      {formatDate(item.date)}
                    </td>
                    <td className={`py-3 px-4 ${themeClasses.cardText} font-medium`}>
                      {item.visits.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-black/10 text-black transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => item.id && onDelete(item.id)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-black/10 text-black transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="flex items-center space-x-4">
                <p className={`text-sm ${themeClasses.subtitle}`}>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
                  {isFiltering && ` (filtered from ${totalDataCount} total)`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page Button */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-black text-white'
                          : 'hover:bg-white/10 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable; 