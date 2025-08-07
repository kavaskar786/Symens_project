import express from "express";
import { body, validationResult } from "express-validator";
import { Marks } from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get marks for a student
router.get(
  "/student/:studentId",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const studentMarks = await Marks.find({
        studentId: req.params.studentId,
      }).populate("studentId", "fullName rollNumber class section");
      res.json(studentMarks);
    } catch (error) {
      console.error("Error fetching marks:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Invalid student ID" });
      }
      res.status(500).json({ message: "Error fetching marks" });
    }
  }
);

// Add or update marks
router.post(
  "/",
  [
    authenticateToken,
    requireRole("teacher"),
    body("studentId").isMongoId().withMessage("Invalid student ID"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("marks").isNumeric().withMessage("Marks must be a number"),
    body("totalMarks").isNumeric().withMessage("Total marks must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { studentId, subject, marks: studentMarks, totalMarks } = req.body;

      // Check if marks already exist for this student and subject
      const existingMark = await Marks.findOne({ studentId, subject });

      if (existingMark) {
        // Update existing marks
        existingMark.marks = studentMarks;
        existingMark.totalMarks = totalMarks;
        const updatedMark = await existingMark.save();

        res.json({
          message: "Marks updated successfully",
          marks: updatedMark,
        });
      } else {
        // Create new marks entry
        const newMark = new Marks({
          studentId,
          subject,
          marks: studentMarks,
          totalMarks,
        });

        const savedMark = await newMark.save();
        res.status(201).json(savedMark);
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Marks already exist for this subject" });
      }
      res.status(500).json({ message: "Error saving marks" });
    }
  }
);

// Delete marks
router.delete(
  "/:id",
  authenticateToken,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const deletedMark = await Marks.findByIdAndDelete(req.params.id);
      if (!deletedMark) {
        return res.status(404).json({ message: "Marks not found" });
      }
      res.json({ message: "Marks deleted successfully" });
    } catch (error) {
      console.error("Error deleting marks:", error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Marks not found" });
      }
      res.status(500).json({ message: "Error deleting marks" });
    }
  }
);

export default router;
