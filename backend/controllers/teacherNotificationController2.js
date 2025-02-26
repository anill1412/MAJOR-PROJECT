const TeacherNotification = require("../models/TeacherNotification");

// Get notifications for a specific teacher
exports.getNotifications = async (req, res) => {
  try {
    const { teacherId } = req.params; // Get teacherId from URL
    if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });

    const notifications = await TeacherNotification.find({ teacherId });

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
