import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, Edit, BookOpen } from 'lucide-react';

interface Student {
  _id: string;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  address: string;
}

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/student/${student._id}`);
  };

  const handleEditMarks = () => {
    navigate(`/student/${student._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
          <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Class:</span>
          <span className="text-sm font-medium text-gray-900">{student.class}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Section:</span>
          <span className="text-sm font-medium text-gray-900">{student.section}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleViewProfile}
          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Profile
        </button>
        
        <button
          onClick={handleEditMarks}
          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Manage Marks
        </button>
      </div>
    </div>
  );
};

export default StudentCard;