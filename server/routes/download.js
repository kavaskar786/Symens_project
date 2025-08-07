import express from "express";
import XLSX from "xlsx";
import { Student, Marks } from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Download Excel report
router.get(
  "/excel",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      // Get all students
      const allStudents = await Student.find({}).sort({
        class: 1,
        section: 1,
        rollNumber: 1,
      });

      // Get all marks with student details
      const allMarks = await Marks.find({}).populate("studentId");

      // Prepare data for Excel
      const excelData = [];

      for (const student of allStudents) {
        const studentMarks = allMarks.filter(
          (mark) =>
            mark.studentId &&
            mark.studentId._id.toString() === student._id.toString()
        );

        if (studentMarks.length === 0) {
          // Student with no marks
          excelData.push({
            Name: student.fullName,
            "Roll Number": student.rollNumber,
            Class: student.class,
            Section: student.section,
            Subject: "No subjects",
            Marks: "No marks",
            "Total Marks": "No marks",
          });
        } else {
          // Student with marks
          studentMarks.forEach((mark) => {
            excelData.push({
              Name: student.fullName,
              "Roll Number": student.rollNumber,
              Class: student.class,
              Section: student.section,
              Subject: mark.subject,
              Marks: mark.marks,
              "Total Marks": mark.totalMarks,
              Percentage:
                ((mark.marks / mark.totalMarks) * 100).toFixed(2) + "%",
            });
          });
        }
      }

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 15 }, // Roll Number
        { wch: 10 }, // Class
        { wch: 10 }, // Section
        { wch: 15 }, // Subject
        { wch: 10 }, // Marks
        { wch: 12 }, // Total Marks
        { wch: 12 }, // Percentage
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Student Marks");

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      // Set headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="student_marks.xlsx"'
      );

      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      res.status(500).json({ message: "Error generating Excel file" });
    }
  }
);

export default router;
