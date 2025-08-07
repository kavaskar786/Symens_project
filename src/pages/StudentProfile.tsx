import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MarksForm from '../components/MarksForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, User, BookOpen, Award, Plus, Edit, Trash2 } from 'lucide-react';

interface Student {
  _id: string;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  address: string;
}

interface Mark {
  _id: string;
  subject: string;
  marks: number;
  totalMarks: number;
}

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMarksForm, setShowMarksForm] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchStudent();
      fetchMarks();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }

      const data = await response.json();
      setStudent(data);
    } catch (error) {
      setError('Failed to load student');
      console.error('Error fetching student:', error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/marks/student/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch marks');
      }

      const data = await response.json();
      setMarks(data);
    } catch (error) {
      setError('Failed to load marks');
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksAdded = () => {
    fetchMarks();
    setShowMarksForm(false);
    setEditingMark(null);
  };

  const handleEditMark = (mark: Mark) => {
    setEditingMark(mark);
    setShowMarksForm(true);
  };

  const handleDeleteMark = async (markId: string) => {
    if (!confirm('Are you sure you want to delete these marks?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/marks/${markId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete marks');
      }

      fetchMarks();
    } catch (error) {
      setError('Failed to delete marks');
      console.error('Error deleting marks:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student Not Found</h3>
            <button
              onClick={() => navigate('/teacher')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
  const totalPossible = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
  const percentage = totalPossible > 0 ? (totalMarks / totalPossible * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/teacher')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-gray-900">{student.fullName}</h1>
                  <p className="text-gray-600">Roll No: {student.rollNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
                  <p className="text-gray-900">{student.class} - {student.section}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{student.address}</p>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Subjects</p>
                        <p className="text-xl font-bold text-gray-900">{marks.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Percentage</p>
                        <p className="text-xl font-bold text-gray-900">{percentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marks Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Academic Records</h2>
                  <button
                    onClick={() => {
                      setEditingMark(null);
                      setShowMarksForm(true);
                    }}
                    className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Marks
                  </button>
                </div>
              </div>

              <div className="p-6">
                {showMarksForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingMark ? 'Edit Marks' : 'Add New Marks'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowMarksForm(false);
                          setEditingMark(null);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <MarksForm
                      studentId={student._id}
                      editingMark={editingMark}
                      onMarksAdded={handleMarksAdded}
                    />
                  </div>
                )}

                {marks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Marks Added Yet</h3>
                    <p className="text-gray-500 mb-6">Start by adding marks for the first subject.</p>
                    <button
                      onClick={() => setShowMarksForm(true)}
                      className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Add First Subject
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {marks.map((mark) => (
                      <div key={mark._id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{mark.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {mark.marks} / {mark.totalMarks} marks
                            <span className="ml-2 text-blue-600">
                              ({((mark.marks / mark.totalMarks) * 100).toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditMark(mark)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMark(mark._id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;