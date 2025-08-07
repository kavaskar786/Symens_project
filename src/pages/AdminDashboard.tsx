import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import StudentForm from "../components/StudentForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { UserPlus, Users, Trash2, MapPin, GraduationCap } from "lucide-react";

interface Student {
  _id: string;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  address: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError("Failed to load students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdded = (newStudent) => {
    setStudents([...students, newStudent]);
    setShowForm(false);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${studentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      setError("Failed to delete student");
      console.error("Error deleting student:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Manage student records and system administration
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(students.map((s) => s.class)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Quick Action
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Add New Student
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Student Management
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>

          <div className="p-6">
            {showForm ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add New Student
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <StudentForm onStudentAdded={handleStudentAdded} />
              </div>
            ) : null}

            {students.length === 0 && !showForm ? (
              <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Students Added Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by adding your first student to the system.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Add First Student
                </button>
              </div>
            ) : students.length > 0 && !showForm ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Students ({students.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {student.fullName}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Roll No: {student.rollNumber}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>
                              Class {student.class} - Section {student.section}
                            </span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {student.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Delete Student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
