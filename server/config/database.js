import mongoose from "mongoose";

// MongoDB connection test 7
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://abishek2002143:vvJhe5xBzVyXghVN@cluster0.uj5g5um.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher"],
    },
  },
  {
    timestamps: true,
  }
);

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Marks Schema
const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
marksSchema.index({ studentId: 1, subject: 1 }, { unique: true });

// Create models
const User = mongoose.model("User", userSchema);
const Student = mongoose.model("Student", studentSchema);
const Marks = mongoose.model("Marks", marksSchema);

export { connectDB, User, Student, Marks };
