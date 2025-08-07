import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface Mark {
  _id: string;
  subject: string;
  marks: number;
  totalMarks: number;
}

interface MarksFormProps {
  studentId: string;
  editingMark?: Mark | null;
  onMarksAdded: () => void;
}

const MarksForm: React.FC<MarksFormProps> = ({ studentId, editingMark, onMarksAdded }) => {
  const [formData, setFormData] = useState({
    subject: '',
    marks: '',
    totalMarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingMark) {
      setFormData({
        subject: editingMark.subject,
        marks: editingMark.marks.toString(),
        totalMarks: editingMark.totalMarks.toString()
      });
    } else {
      setFormData({
        subject: '',
        marks: '',
        totalMarks: ''
      });
    }
  }, [editingMark]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const marks = parseInt(formData.marks);
    const totalMarks = parseInt(formData.totalMarks);

    if (marks > totalMarks) {
      setError('Marks cannot be greater than total marks');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          studentId,
          subject: formData.subject,
          marks,
          totalMarks
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save marks');
      }

      onMarksAdded();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter subject name"
          disabled={!!editingMark} // Disable editing subject name
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-2">
            Marks Obtained *
          </label>
          <input
            type="number"
            id="marks"
            name="marks"
            required
            min="0"
            value={formData.marks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter marks obtained"
          />
        </div>

        <div>
          <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks *
          </label>
          <input
            type="number"
            id="totalMarks"
            name="totalMarks"
            required
            min="1"
            value={formData.totalMarks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter total marks"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            editingMark ? 'Update Marks' : 'Add Marks'
          )}
        </button>
      </div>
    </form>
  );
};

export default MarksForm;