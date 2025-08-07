import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface StudentFormProps {
  onStudentAdded: (student: any) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    class: '',
    section: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add student');
      }

      const student = await response.json();
      onStudentAdded(student);
      setFormData({
        fullName: '',
        rollNumber: '',
        class: '',
        section: '',
        address: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add student');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter student's full name"
          />
        </div>

        <div>
          <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Roll Number *
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            required
            value={formData.rollNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter roll number"
          />
        </div>

        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
            Class *
          </label>
          <input
            type="text"
            id="class"
            name="class"
            required
            value={formData.class}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 10th, 12th"
          />
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
            Section *
          </label>
          <input
            type="text"
            id="section"
            name="section"
            required
            value={formData.section}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., A, B, C"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={3}
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter student's address"
        />
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
              Adding...
            </div>
          ) : (
            'Add Student'
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;