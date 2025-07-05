import React, { useState } from 'react';
import { Edit2, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';

interface DataTableProps {
  data: TrafficData[];
  loading: boolean;
  onEdit: (item: TrafficData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

type SortField = 'date' | 'visits';
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data, loading, onEdit, onDelete, onAdd }) => {
  const { themeClasses } = useTheme();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
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
      <ChevronUp className="w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className={`${themeClasses.card} p-8`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.card} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${themeClasses.title}`}>Traffic Data</h3>
        <button
          onClick={onAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className={themeClasses.subtitle}>No traffic data available</p>
          <p className={`${themeClasses.subtitle} text-sm mt-2`}>
            Click "Add Entry" to create your first traffic record
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
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
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-white/5 transition-colors"
                  >
                    <td className={`py-3 px-4 ${themeClasses.cardText}`}>
                      {formatDate(item.date)}
                    </td>
                    <td className={`py-3 px-4 ${themeClasses.cardText} font-medium`}>
                      {item.visits.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => item.id && onDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className={`text-sm ${themeClasses.subtitle}`}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                >
                  Previous
                </button>
                <span className={`px-3 py-1 ${themeClasses.cardText}`}>
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${themeClasses.button} transition-colors`}
                >
                  Next
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