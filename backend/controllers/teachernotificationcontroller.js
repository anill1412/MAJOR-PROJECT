const TeacherNotification = require("../models/TeacherNotification");
const mongoose = require("mongoose");

// Get notifications for a specific teacher
exports.getNotifications = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });

    const notifications = await TeacherNotification.find({ teacherId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Add a new notification
// exports.addNotification = async (req, res) => {
//   try {
//     const { emails, message } = req.body;

//     if (!emails || emails.length === 0) {
//       return res.status(400).json({ message: "No recipients selected" });
//     }
//     if (!message) {
//       return res.status(400).json({ message: "Message is required" });
//     }
    
//     // Create an array of notification objects
//     const notifications = emails.map((email) => ({
//       teacherId: email,
//       message: message,
//     }));

//     // Insert notifications into MongoDB as separate documents
//     await Notification.insertMany(notifications);

//     res.json({ success: true, message: "Notifications saved successfully!" });
//   } catch (error) {
//     console.error("Error saving notifications:", error);
//     res.status(500).json({ message: "Failed to send notifications", error });
//   }
// };
exports.addNotification = async (req, res) => {
  try {
    console.log("Request received:", req.body); // Log incoming request data

    const { recipients, message } = req.body;

    if (!recipients || recipients.length === 0 || !message) {
      console.log("Missing recipients or message");
      return res.status(400).json({ error: "Recipients and message are required." });
    }

    // Check if MongoDB connection is working
    if (!mongoose.connection.readyState) {
      console.log("MongoDB connection error");
      return res.status(500).json({ error: "Database connection error" });
    }

    // Store notifications for each recipient
    const notifications = await Promise.all(
      recipients.map(async (email) => {
        console.log("Saving notification for:", email);
        return await TeacherNotification.create({
          teacherId: email,  // Make sure this matches the schema field
          message,
        });
      })
    );

    console.log("Notifications saved:", notifications);
    res.status(201).json({ message: "Notifications sent successfully", notifications });
  } catch (error) {
    console.error("Error in addNotification:", error);
    res.status(500).json({ error: "Failed to send notifications", details: error.message });
  }
};



// Delete a notification
// exports.deleteNotification = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await TeacherNotification.findByIdAndDelete(id);
//     res.json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting notification" });
//   }
// };
// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the notification exists
      const notification = await TeacherNotification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      await TeacherNotification.findByIdAndDelete(id);
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
  };
  
