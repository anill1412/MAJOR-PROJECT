

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const TeacherNotification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState("");

//   const BASE_URL = "http://localhost:5000"; 

//   // Get the current user from Redux
//   const currentUser = useSelector((state) => state.user.currentUser);
  
//   // Extract teacher's email from the current user
//   const teacherEmail = currentUser?.role === "Teacher" ? currentUser.email : null;
  
//   useEffect(() => {
//     if (teacherEmail) {
//       fetchNotifications(teacherEmail);
//     }
//   }, [teacherEmail]);

//   const fetchNotifications = async (email) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/notifications`, {
//         params: { teacherId: email },
//       });
      
//       setNotifications(response.data);
//     } catch (error) {
//       setError(
//         error.response?.data?.message || "Error fetching notifications. Please try again later."
//       );
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2>Teacher Notifications</h2>

//       {/* Error Message */}
//       {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

//       {/* Display Notifications */}
//       {teacherEmail ? (
//         notifications.length > 0 ? (
//           <ul style={{ marginTop: "10px" }}>
//             {notifications.map((notification) => (
//               <li key={notification._id} style={{ marginBottom: "5px" }}>
//                 {notification.message}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p style={{ marginTop: "10px" }}>No notifications found</p>
//         )
//       ) : (
//         <p style={{ marginTop: "10px", color: "red" }}>
//           You are not authorized to view notifications.
//         </p>
//       )}
//     </div>
//   );
// };

// export default TeacherNotification;
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const TeacherNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:5000"; 

  // Get the current user from Redux
  const currentUser = useSelector((state) => state.user.currentUser);
  const teacherEmail = currentUser?.role === "Teacher" ? currentUser.email : null;

  useEffect(() => {
    if (teacherEmail) {
      fetchNotifications(teacherEmail);
    }
  }, [teacherEmail]);

  const fetchNotifications = async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/notifications`, {
        params: { teacherId: email },
      });

      // Sort notifications by `createdAt` in descending order (latest first)
      const sortedNotifications = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      setError(
        error.response?.data?.message || "Error fetching notifications. Please try again later."
      );
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="notification-container">
      <h2 className="notification-header">Messages from Admin</h2>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display Notifications */}
      {teacherEmail ? (
        notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification._id} className="notification-item">
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications">No messages at the moment</p>
        )
      ) : (
        <p className="unauthorized-message">
          You are not authorized to view messages.
        </p>
      )}
    </div>
  );
};

export default TeacherNotification;

