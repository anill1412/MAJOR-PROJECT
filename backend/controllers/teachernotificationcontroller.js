const TeacherNotification = require("../models/TeacherNotification");

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
exports.addNotification = async (req, res) => {
  try {
    const { teacherId, message } = req.body;
    if (!teacherId || !message) return res.status(400).json({ message: "Teacher ID and message are required" });

    const newNotification = new TeacherNotification({ teacherId, message });
    await newNotification.save();

    res.status(201).json({ message: "Notification added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding notification" });
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
  
