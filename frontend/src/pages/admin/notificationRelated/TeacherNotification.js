// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:5000"; // Use the environment variable

// const TeacherNotification = () => {
//   const [teacherId, setTeacherId] = useState("");
//   const [message, setMessage] = useState("");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Fetch notifications from backend
//   const fetchNotifications = async () => {
//     if (!teacherId) return alert("Enter Teacher EmailID!");
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.get(`${BASE_URL}/api/notifications`, {
//         params: { teacherId },
//       });
      
//       setNotifications(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch notifications when teacherId changes
//   useEffect(() => {
//     if (teacherId) fetchNotifications();
//   }, [teacherId]);

//   // Add a notification
//   const addNotification = async () => {
//     if (!teacherId || !message) return alert("Enter both EmailID and message");

//     try {
//       await axios.post(`${BASE_URL}/api/notifications`, { teacherId, message });

//       // Refresh notifications after adding
//       fetchNotifications();
//       setMessage("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add notification");
//     }
//   };

//   // Delete a notification
//   const deleteNotification = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/api/notifications/${id}`);

//       // Refresh notifications after deletion
//       fetchNotifications();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete notification");
//     }
//   };

//   return (
//     <div>
//       <h2>Notifications</h2>

//       <div>
//         <input
//           type="text"
//           placeholder="Enter Teacher EmailID"
//           value={teacherId}
//           onChange={(e) => setTeacherId(e.target.value)}
//         />
//         <button onClick={fetchNotifications}>Load Notifications</button>
//       </div>

//       <div>
//         <input
//           type="text"
//           placeholder="Enter Notification Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={addNotification}>Add Notification</button>
//       </div>

//       {loading && <p>Loading notifications...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <ul>
//         {notifications.map((notification) => (
//           <li key={notification.id}>
//             {notification.message}
//             <button onClick={() => deleteNotification(notification.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TeacherNotification;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:5000"; // Backend URL

// const TeacherNotification = () => {
//   const [teachers, setTeachers] = useState([]); // Stores all teacher emails
//   const [selectedTeachers, setSelectedTeachers] = useState([]); // Selected teacher emails
//   const [message, setMessage] = useState(""); // Notification message
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch all teacher emails from the database
//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/teachers`);
//         setTeachers(response.data);
//       } catch (err) {
//         setError("Failed to fetch teacher emails.");
//       }
//     };
//     fetchTeachers();
//   }, []);

//   // Handle checkbox selection
//   const handleCheckboxChange = (email) => {
//     setSelectedTeachers((prev) =>
//       prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
//     );
//   };

//   // Select all teachers
//   const handleSelectAll = () => {
//     if (selectedTeachers.length === teachers.length) {
//       setSelectedTeachers([]); // Deselect all
//     } else {
//       setSelectedTeachers(teachers.map((t) => t.email)); // Select all
//     }
//   };

//   // Send notification to selected teachers
//   const sendNotification = async () => {
//     if (selectedTeachers.length === 0 || !message) {
//       return alert("Select at least one teacher and enter a message.");
//     }

//     try {
//       await axios.post(`${BASE_URL}/api/notifications`, {
//         recipients: selectedTeachers,
//         message,
//       });
//       setSuccess("Notification sent successfully!");
//       setError("");
//       setMessage(""); // Clear message input
//     } catch (err) {
//       setError("Failed to send notifications.");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2>Send Notifications</h2>

//       {/* Error and Success Messages */}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       {/* Teacher Selection List */}
//       <div>
//         <h3>Select Teachers:</h3>
//         <button onClick={handleSelectAll}>
//           {selectedTeachers.length === teachers.length ? "Deselect All" : "Select All"}
//         </button>
//         <ul style={{ listStyleType: "none", padding: 0 }}>
//           {teachers.map((teacher) => (
//             <li key={teacher.email}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={selectedTeachers.includes(teacher.email)}
//                   onChange={() => handleCheckboxChange(teacher.email)}
//                 />
//                 {teacher.email}
//               </label>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Notification Input */}
//       <div>
//         <input
//           type="text"
//           placeholder="Enter Notification Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           style={{ marginTop: "10px", padding: "5px", width: "100%" }}
//         />
//       </div>

//       {/* Send Notification Button */}
//       <button onClick={sendNotification} style={{ marginTop: "10px" }}>
//         Send Notification
//       </button>
//     </div>
//   );
// };

// export default TeacherNotification;

import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Backend API URL

const TeacherNotification = () => {
  const [teachers, setTeachers] = useState([]); // Stores all teacher emails
  const [selectedTeachers, setSelectedTeachers] = useState([]); // Selected emails
  const [message, setMessage] = useState(""); // Notification message
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all teacher emails from the database
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/teacher/emails`);
        setTeachers(response.data); // Store email list
      } catch (err) {
        setError("Failed to fetch teacher emails.");
      }
    };
    fetchTeachers();
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (email) => {
    setSelectedTeachers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };
  
  // Select/Deselect all teachers
  const handleSelectAll = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]); // Deselect all
    } else {
      setSelectedTeachers(teachers.map((t) => t.email)); // Select all
    }
  };
  
  // Send notification to selected teachers
  // const sendNotification = async () => {
  //   if (selectedTeachers.length === 0 || !message.trim()) {
  //     setError("Select at least one teacher and enter a message.");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${BASE_URL}/api/notifications`, {
  //       recipients: selectedTeachers,
  //       message,
  //     });
  //     setSuccess("Notification sent successfully!");
  //     setError("");
  //     setMessage(""); // Clear input
  //     setSelectedTeachers([]); // Clear selection
  //   } catch (err) {
  //     setError("Failed to send notifications.");
  //   }
  // };
  // const sendNotification = async () => {
  //   if (selectedTeachers.length === 0 || !message.trim()) {
  //     setError("Select at least one teacher and enter a message.");
  //     return;
  //   }
  
  //   try {
  //     const response = await axios.post(`${BASE_URL}/api/notifications`, {
  //       recipients: selectedTeachers, // Make sure this matches backend expectation
  //       message,
  //     });
  
  //     if (response.status === 201) {
  //       setSuccess("Notification sent successfully!");
  //       setError("");
  //       setMessage(""); // Clear input
  //       setSelectedTeachers([]); // Clear selection
  //     } else {
  //       setError("Failed to send notifications.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to send notifications.");
  //   }
  // };
  const sendNotification = async () => {
    if (selectedTeachers.length === 0 || !message.trim()) {
      setError("Select at least one teacher and enter a message.");
      return;
    }
  
    console.log("Sending notification to:", selectedTeachers, "Message:", message);
  
    try {
      const response = await axios.post(`${BASE_URL}/api/notifications`, {
        recipients: selectedTeachers,
        message,
      });
  
      console.log("Response from server:", response.data);
  
      if (response.status === 201) {
        setSuccess("Notification sent successfully!");
        setError("");
        setMessage("");
        setSelectedTeachers([]);
      } else {
        setError("Failed to send notifications.");
      }
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      setError(`Failed to send notifications. ${err.response?.data?.error || ''}`);
    }
  };
  
  
  
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <center>  <h2>Send Notifications</h2></center>

      {/* Error and Success Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Teacher Selection List */}
      <div>
        <h3>Select Teachers:</h3>
        <button onClick={handleSelectAll}>
          {selectedTeachers.length === teachers.length ? "Deselect All" : "Select All"}
        </button>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {teachers.map((teacher) => (
            <li key={teacher.email}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(teacher.email)}
                  onChange={() => handleCheckboxChange(teacher.email)}
                />
                {teacher.email}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Notification Input */}
      <div>
        <input
          type="text"
          placeholder="Enter Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginTop: "10px", padding: "5px", width: "100%" }}
        />
      </div>
      
      {/* Send Notification Button */}
      <button onClick={sendNotification} style={{ marginTop: "10px" }}>
        Send Notification
      </button>
    </div>
  );
};

export default TeacherNotification;
