import React, { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import "./timetable.css";

const REACT_APP_BASE_URL = "http://localhost:5000"; // Backend URL

const TimeTable = () => {
  const [className, setClassName] = useState(""); // State for class name
  const [teachers, setTeachers] = useState([]); // State to hold teacher data
  const [timetable, setTimetable] = useState({}); // State to hold generated timetable
  const [error, setError] = useState(""); // State to display errors

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 1:00",  // Lunch time updated
    "1:00 - 2:00",
    "2:00 - 3:00",
  ]; // Updated times with correct lunch slot
  const fallbackSubjects = ["Sports", "Tutorial", "Library"]; // Fallback for empty slots

  // Handle input change for class name
  const handleClassNameChange = (e) => {
    setClassName(e.target.value.toUpperCase()); // Convert input to uppercase
    setError("");
  };

  // Fetch teacher data based on class name
  const fetchTeacherData = async (className) => {
    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/api/fetchPreferences?classSection=${className}`
      );
      
      // Check if data is an array before returning
      if (Array.isArray(response.data.data)) {
        return response.data.data; // Return teacher data from the backend
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      setError("An error occurred while fetching teacher data.");
      return []; // Return empty array in case of error
    }
  };

  // Generate timetable based on teacher preferences
  const generateTimetable = async () => {
    if (!className) {
      setError("Please enter a valid class name.");
      return;
    }

    const fetchedTeachers = await fetchTeacherData(className); // Fetch teacher data asynchronously

    if (fetchedTeachers.length === 0) {
      setError("No teacher data available for the provided class.");
      return;
    }

    setTeachers(fetchedTeachers); // Set fetched teacher data

    const generatedTimetable = {};
    days.forEach((day) => {
      const dailySubjects = new Set();
      generatedTimetable[day] = {};

      times.forEach((time) => {
        if (time === "12:00 - 1:00") {  // Place lunch between 12:00 - 1:00
          generatedTimetable[day][time] = "Lunch";
        } else {
          const availableTeachers = fetchedTeachers.filter((teacher) =>
            teacher.availability[day]?.includes(time) &&
            !dailySubjects.has(teacher.subject)
          );

          if (availableTeachers.length > 0) {
            const teacher =
              availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
            generatedTimetable[day][time] = teacher.subject;
            dailySubjects.add(teacher.subject);
          } else {
            generatedTimetable[day][time] =
              fallbackSubjects[Math.floor(Math.random() * fallbackSubjects.length)];
          }
        }
      });
    });

    setTimetable(generatedTimetable);
    console.log("Generated Timetable:", generatedTimetable);
  };

  const saveTimetable = async () => {
    if (!className || Object.keys(timetable).length === 0) {
      setError("Please generate a timetable before saving.");
      return;
    }
  
    const formattedTimetable = {
      className: className,
      timetable: {
        Monday: {
          "9:00 - 10:00": timetable.Monday["9:00 - 10:00"] || "-",
          "10:00 - 11:00": timetable.Monday["10:00 - 11:00"] || "-",
          "11:00 - 12:00": timetable.Monday["11:00 - 12:00"] || "-",
          "12:00 - 1:00": timetable.Monday["12:00 - 1:00"] || "Lunch",
          "1:00 - 2:00": timetable.Monday["1:00 - 2:00"] || "-",
          "2:00 - 3:00": timetable.Monday["2:00 - 3:00"] || "-",
        },
        Tuesday: {
          "9:00 - 10:00": timetable.Tuesday["9:00 - 10:00"] || "-",
          "10:00 - 11:00": timetable.Tuesday["10:00 - 11:00"] || "-",
          "11:00 - 12:00": timetable.Tuesday["11:00 - 12:00"] || "-",
          "12:00 - 1:00": timetable.Tuesday["12:00 - 1:00"] || "Lunch",
          "1:00 - 2:00": timetable.Tuesday["1:00 - 2:00"] || "-",
          "2:00 - 3:00": timetable.Tuesday["2:00 - 3:00"] || "-",
        },
        Wednesday: {
          "9:00 - 10:00": timetable.Wednesday["9:00 - 10:00"] || "-",
          "10:00 - 11:00": timetable.Wednesday["10:00 - 11:00"] || "-",
          "11:00 - 12:00": timetable.Wednesday["11:00 - 12:00"] || "-",
          "12:00 - 1:00": timetable.Wednesday["12:00 - 1:00"] || "Lunch",
          "1:00 - 2:00": timetable.Wednesday["1:00 - 2:00"] || "-",
          "2:00 - 3:00": timetable.Wednesday["2:00 - 3:00"] || "-",
        },
        Thursday: {
          "9:00 - 10:00": timetable.Thursday["9:00 - 10:00"] || "-",
          "10:00 - 11:00": timetable.Thursday["10:00 - 11:00"] || "-",
          "11:00 - 12:00": timetable.Thursday["11:00 - 12:00"] || "-",
          "12:00 - 1:00": timetable.Thursday["12:00 - 1:00"] || "Lunch",
          "1:00 - 2:00": timetable.Thursday["1:00 - 2:00"] || "-",
          "2:00 - 3:00": timetable.Thursday["2:00 - 3:00"] || "-",
        },
        Friday: {
          "9:00 - 10:00": timetable.Friday["9:00 - 10:00"] || "-",
          "10:00 - 11:00": timetable.Friday["10:00 - 11:00"] || "-",
          "11:00 - 12:00": timetable.Friday["11:00 - 12:00"] || "-",
          "12:00 - 1:00": timetable.Friday["12:00 - 1:00"] || "Lunch",
          "1:00 - 2:00": timetable.Friday["1:00 - 2:00"] || "-",
          "2:00 - 3:00": timetable.Friday["2:00 - 3:00"] || "-",
        },
      },
    };
  
    try {
      await axios.post(`${REACT_APP_BASE_URL}/api/saveTimetable`, formattedTimetable);
      alert("Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
      setError("An error occurred while saving the timetable.");
    }
  };
  

  const openTimetable = async () => {
    if (!className) {
      setError("Please enter a class name to open its timetable.");
      return;
    }

    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/api/getTimetable?className=${className}`
      );

      if (response.data?.timetable) {
        setTimetable(response.data.timetable);
        console.log("DONE");
        console.log("Timetable loaded:", JSON.stringify(response.data, null, 2));
        alert("Timetable loaded successfully!");
      } else {
        setError("No timetable found for the provided class.");
      }
    } catch (error) {
      console.error("Error opening timetable:", error);
      setError("An error occurred while fetching the timetable.");
    }
  };

  const downloadAsCSV = () => {
    const csvContent = [
      ["Day / Time", ...times],
      ...days.map((day) => [
        day,
        ...times.map((time) => timetable[day]?.[time] || "-"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${className}_timetable.csv`;
    link.click();
  };

  // Function to download the timetable as an image
  const downloadAsImage = async () => {
    const tableElement = document.getElementById("timetable");
    if (!tableElement) return;

    const canvas = await html2canvas(tableElement);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${className}_timetable.png`;
    link.click();
  };


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Timetable Generator</h2>

      <div>
        <label>
          Enter Class Name (e.g., CSIT1A):
          <input
            type="text"
            value={className}
            onChange={handleClassNameChange}
            placeholder="CSIT1A"
            style={{ margin: "10px" }}
          />
        </label>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <button onClick={generateTimetable} style={{ marginTop: "10px" }}>Generate Timetable</button>
        <button onClick={saveTimetable} style={{ marginLeft: "10px" }}>Save Timetable</button>
        <button onClick={openTimetable} style={{ marginLeft: "10px" }}>Open Timetable</button>
        <button onClick={downloadAsCSV} style={{ marginLeft: "10px" }}>Download as CSV</button>
        <button onClick={downloadAsImage} style={{marginLeft: "10px" }}>Download as Image</button>
      </div>

      {/* Render Timetable */}
      {Object.keys(timetable).length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Timetable</h3>
          <table border="1" style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Day / Time</th>
                {times.map((time) => (
                  <th key={time}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td>{day}</td>
                  {times.map((time) => (
                    <td key={time} style={{ textAlign: "center" }}>
                      {timetable[day]?.[time] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
};

export default TimeTable;
