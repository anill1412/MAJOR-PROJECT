// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const TeacherNotifications = ({ teacherId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const REACT_APP_BASE_URL = "http://localhost:5000"; // Your backend URL

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`${REACT_APP_BASE_URL}/api/notifications/teacher/${teacherId}`);
//         setNotifications(response.data);
//       } catch (error) {
//         console.error("Error fetching notifications:", error.message);
//       }
//     };

//     fetchNotifications();
//   }, [teacherId]);

//   return (
//     <div>
//       <h2>Teacher Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications found</p>
//       ) : (
//         <ul>
//           {notifications.map((notification) => (
//             <li key={notification._id}>{notification.message}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default TeacherNotifications;
import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherNotification = () => {
  const [teacherId, setTeacherId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:5000"; 

  const fetchNotifications = async () => {
    if (!teacherId.trim()) {
      setError("Please enter a valid Teacher ID.");
      return;
    }

    setError(""); // Clear previous errors

    try {
      const response = await axios.get(`${BASE_URL}/api/notifications/teacher/${teacherId}`);
      setNotifications(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Error fetching notifications. Please check the Teacher ID."
      );
      console.error("Error fetching notifications:", error);
    }
  };

  // Clear notifications when teacherId changes
  useEffect(() => {
    setNotifications([]);
    setError("");
  }, [teacherId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Teacher Notifications</h2>

      {/* Input Field for Teacher ID */}
      <input
        type="text"
        placeholder="Enter Teacher ID"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        aria-label="Teacher ID"
        style={{
          padding: "8px",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        onClick={fetchNotifications}
        style={{
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Get Notifications
      </button>

      {/* Error Message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Display Notifications */}
      {notifications.length === 0 && !error ? (
        <p style={{ marginTop: "10px" }}>No notifications found</p>
      ) : (
        <ul style={{ marginTop: "10px" }}>
          {notifications.map((notification) => (
            <li key={notification._id} style={{ marginBottom: "5px" }}>
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherNotification;

