import express from "express";
import { body, validationResult } from "express-validator";
import { Student } from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all students (Admin and Teacher)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// Get single student
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).json({ message: "Error fetching student" });
  }
});

// Add new student (Admin only)
router.post(
  "/",
  [
    authenticateToken,
    requireRole("admin"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("rollNumber").notEmpty().withMessage("Roll number is required"),
    body("class").notEmpty().withMessage("Class is required"),
    body("section").notEmpty().withMessage("Section is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        fullName,
        rollNumber,
        class: studentClass,
        section,
        address,
      } = req.body;

      // Check if roll number already exists
      const existingStudent = await Student.findOne({ rollNumber });
      if (existingStudent) {
        return res.status(400).json({ message: "Roll number already exists" });
      }

      const newStudent = new Student({
        fullName,
        rollNumber,
        class: studentClass,
        section,
        address,
      });

      const savedStudent = await newStudent.save();
      res.status(201).json(savedStudent);
    } catch (error) {
      console.error("Error creating student:", error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Roll number already exists" });
      }
      res.status(500).json({ message: "Error creating student" });
    }
  }
);

// Update student (Admin only)
router.put(
  "/:id",
  [
    authenticateToken,
    requireRole("admin"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("rollNumber").notEmpty().withMessage("Roll number is required"),
    body("class").notEmpty().withMessage("Class is required"),
    body("section").notEmpty().withMessage("Section is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        fullName,
        rollNumber,
        class: studentClass,
        section,
        address,
      } = req.body;

      // Check if roll number already exists for another student
      const existingStudent = await Student.findOne({
        rollNumber,
        _id: { $ne: req.params.id },
      });
      if (existingStudent) {
        return res.status(400).json({ message: "Roll number already exists" });
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { fullName, rollNumber, class: studentClass, section, address },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Student not found" });
      }
      if (error.code === 11000) {
        return res.status(400).json({ message: "Roll number already exists" });
      }
      res.status(500).json({ message: "Error updating student" });
    }
  }
);

// Delete student (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const deletedStudent = await Student.findByIdAndDelete(req.params.id);
      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(500).json({ message: "Error deleting student" });
    }
  }
);

export default router;
