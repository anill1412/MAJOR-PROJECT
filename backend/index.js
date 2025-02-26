const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const Routes = require("./routes/route.js");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/Education", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Teacher Schema
const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  subject: { type: String, required: true },
  classSection: { type: String, required: true },
  availability: {
    type: Map,
    of: [String],
    required: true,
  },
});

// Create Teacher Model
const Teacher = mongoose.model("Teacher", teacherSchema, "teacher2");

// Define Timetable Schema
const timetableSchema = new mongoose.Schema({
  className: String,
  timetable: Object,
});

// Function to get a dynamic Timetable Model
const getTimetableModel = (className) => {
  return mongoose.models[className] || mongoose.model(className, timetableSchema);
};

// API to fetch teacher preferences
app.get('/api/fetchPreferences', async (req, res) => {
  const { classSection } = req.query;
  try {
    const teacherData = await Teacher.find({ classSection });
    if (teacherData.length > 0) {
      res.status(200).json({ success: true, data: teacherData });
    } else {
      res.status(404).json({ success: false, message: 'No teacher data found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// API to store teacher details
app.post("/api/teachers", async (req, res) => {
  const { teacherId, subject, classSection, availability } = req.body;
  if (!teacherId || !subject || !classSection || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newTeacher = new Teacher({ teacherId, subject, classSection, availability });
    await newTeacher.save();
    res.status(201).json({ message: "Teacher details stored successfully!" });
  } catch (error) {
    console.error("Error storing teacher details:", error);
    res.status(500).json({ message: "Failed to store teacher details" });
  }
});

// API to save the timetable
app.post("/api/saveTimetable", async (req, res) => {
  const { className, timetable } = req.body;
  if (!className || !timetable) {
    return res.status(400).json({ message: "Class name and timetable are required" });
  }
  try {
    const TimetableModel = getTimetableModel(className);
    const newTimetable = new TimetableModel({ className,timetable });
    await newTimetable.save();
    res.status(201).json({ message: "Timetable saved successfully!" });
  } catch (error) {
    console.error("Error saving timetable:", error);
    res.status(500).json({ message: "Failed to save timetable" });
  }
});

// API to get the timetable
app.get("/api/getTimetable", async (req, res) => {
  const { className } = req.query;
  if (!className) {
    return res.status(400).json({ message: "Class name is required" });
  }
  try {
    const TimetableModel = getTimetableModel(className);
    const timetable = await TimetableModel.findOne();
    if (timetable) {
      res.status(200).json({ timetable: timetable.timetable });
    } else {
      res.status(404).json({ message: "No timetable found for the given class" });
    }
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
});
app.get('/api/getFacultyTimetable/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find all documents in the MongoDB collection matching the teacherId
    const teacherData = await Teacher.find({ teacherId: teacherId });

    if (!teacherData || teacherData.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    // If teacher data exists, return all relevant timetables (for multiple subjects/classes)
    const timetables = teacherData.map(teacher => ({
      subject: teacher.subject,
      classSection: teacher.classSection,
      availability: teacher.availability,
    }));

    res.json({ timetables });
  } catch (error) {
    console.error('Error fetching teacher timetables:', error);
    res.status(500).json({ message: 'An error occurred while fetching the timetable.' });
  }
});


app.get('/api/getClassTimetable', async (req, res) => {
  const { className } = req.query;

  if (!className) {
    console.log("Class name not provided");
    return res.status(400).json({ message: 'Class name is required.' });
  }

  try {
    // Log the received class name
    console.log("Received class name:", className);

    // Find the timetable for the provided className
    const TimetableModel = getTimetableModel(className);
    const timetable = await TimetableModel.find({});

    if (!timetable || timetable.length==0) {
      console.log(`No timetable found for class: ${className}`);
      return res.status(404).json({ message: 'No timetable found for this class.' });
    }

    // Log the timetable data if found
    console.log("Found timetable:", timetable);

    // Return the timetable data in JSON format
    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable data:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// API to fetch teacher availability for a class
app.get('/api/teachers/availability/:classSection', async (req, res) => {
  const { classSection } = req.params;
  try {
    const teacherPreferences = await Teacher.find({ classSection });
    const filledSlots = teacherPreferences.flatMap((pref) =>
      Object.keys(pref.availability).map((day) =>
        pref.availability[day].map((slot) => `${day}-${slot}`)
      )
    ).flat();
    res.json(filledSlots);
  } catch (error) {
    res.status(500).send('Error fetching availability');
  }
});

// Use routes
app.use("/", Routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
