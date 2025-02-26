import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Use the environment variable

const TeacherNotification = () => {
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!teacherId) return alert("Enter Teacher ID first!");
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BASE_URL}/api/notifications`, {
        params: { teacherId },
      });

      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications when teacherId changes
  useEffect(() => {
    if (teacherId) fetchNotifications();
  }, [teacherId]);

  // Add a notification
  const addNotification = async () => {
    if (!teacherId || !message) return alert("Enter both ID and message");

    try {
      await axios.post(`${BASE_URL}/api/notifications`, { teacherId, message });

      // Refresh notifications after adding
      fetchNotifications();
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add notification");
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${id}`);

      // Refresh notifications after deletion
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    }
  };

  return (
    <div>
      <h2>Teacher Notifications</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <button onClick={fetchNotifications}>Load Notifications</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Enter Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={addNotification}>Add Notification</button>
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}
            <button onClick={() => deleteNotification(notification.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherNotification;
