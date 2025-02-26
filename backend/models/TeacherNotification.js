const mongoose = require("mongoose");

const TeacherNotificationSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TeacherNotification", TeacherNotificationSchema);
