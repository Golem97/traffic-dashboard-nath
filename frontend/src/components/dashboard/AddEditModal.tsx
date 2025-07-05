import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; visits: number }) => Promise<void>;
  editData?: TrafficData | null;
  loading?: boolean;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editData, 
  loading = false 
}) => {
  const { themeClasses } = useTheme();
  const [formData, setFormData] = useState({
    date: '',
    visits: ''
  });
  const [errors, setErrors] = useState<{ date?: string; visits?: string }>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date,
        visits: editData.visits.toString()
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        visits: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors: { date?: string; visits?: string } = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.visits) {
      newErrors.visits = 'Visits is required';
    } else {
      const visits = parseInt(formData.visits);
      if (isNaN(visits) || visits < 0) {
        newErrors.visits = 'Visits must be a positive number';
      } else if (visits > 1000000) {
        newErrors.visits = 'Visits cannot exceed 1,000,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSave({
        date: formData.date,
        visits: parseInt(formData.visits)
      });
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.card} w-full max-w-md mx-auto`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${themeClasses.title}`}>
            {editData ? 'Edit Traffic Entry' : 'Add Traffic Entry'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${themeClasses.subtitle} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.title} mb-2`}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 ${themeClasses.cardText}`}
                disabled={loading}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.title} mb-2`}>
                Visits
              </label>
              <input
                type="number"
                min="0"
                max="1000000"
                value={formData.visits}
                onChange={(e) => handleInputChange('visits', e.target.value)}
                placeholder="Enter number of visits"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.visits 
                    ? 'border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 ${themeClasses.cardText}`}
                disabled={loading}
              />
              {errors.visits && (
                <p className="text-red-500 text-sm mt-1">{errors.visits}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${themeClasses.button} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{editData ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal; 