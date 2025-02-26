// src/components/TeacherDashboard.js
import React, { useState } from 'react';
import axios from 'axios';
const REACT_APP_BASE_URL = "http://localhost:5000"; // Backend URL
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = [9, 10, 11, 1, 2]; // Skipping 12 PM for lunch


const TeacherPreferences = () => {
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [classSection, setClassSection] = useState('');
  const [availability, setAvailability] = useState({});
  const [classSectionError, setClassSectionError] = useState('');
  const [error, setError] = useState("");
  const [timetable, setTimetable] = useState({});
  const [filteredTimetable, setFilteredTimetable] = useState(null); // State to store filtered timetable
  const [teacherTimetable, setTeacherTimetable] = useState(null); // State to store faculty timetable
  const [showTable, setShowTable] = useState(false); // Controls table visibility

  const handleTeacherIdChange = (e) => setTeacherId(e.target.value);
  const handleSubjectChange = (e) => setSubject(e.target.value);

  const handleClassSectionChange = (e) => {
    const value = e.target.value.toUpperCase();
    setClassSection(value);
    const regex = /^[A-Z]+[1-4][A-Z]$/; // Format: CSIT + Year (1-4) + Section (A-Z)
    if (!regex.test(value)) {
      setClassSectionError("Format must be CSIT1A, CSIT2B, etc. (Year 1-4 and Section A-Z)");
    } else {
      setClassSectionError('');
    }
  };

  const handleCheckboxChange = (day, hour) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [`${day}-${hour}`]: !prevAvailability[`${day}-${hour}`],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (classSectionError || !classSection) {
      alert("Please correct the Class & Section format before submitting.");
      return;
    }

    const formattedAvailability = daysOfWeek.reduce((acc, day) => {
      acc[day] = hours
        .filter((hour) => availability[`${day}-${hour}`])
        .map((hour) => `${hour}:00 - ${hour + 1}:00`);
      return acc;
    }, {});

    const formattedData = {
      teacherId,
      subject,
      classSection,
      availability: formattedAvailability,
    };

    try {
      await axios.post(`http://localhost:5000/api/teachers`, formattedData);
      alert('Details submitted successfully!');
      setTeacherId('');
      setSubject('');
      setClassSection('');
      setAvailability({});
    } catch (error) {
      console.error('Error submitting details:', error);
      alert('Error submitting details. Please try again.');
    }
  };
  const handleCheckAvailability = async () => {
    const className = prompt("Enter class name (e.g., csit1as):");
    if (!className) {
      setError("Please enter a class name to open its timetable.");
      return;
    }
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}/api/getTimetable?className=${className}`);
      if (response.data?.timetable) {
        setTimetable(response.data.timetable);
        const filtered = Object.keys(response.data.timetable).reduce((result, day) => {
          const timings = response.data.timetable[day];
          const filteredTimings = Object.keys(timings).filter(time => ['Sports', 'Tutorial', 'Library'].includes(timings[time]));
          if (filteredTimings.length > 0) {
            result[day] = filteredTimings.map(time => ({ time, subject: timings[time] }));
          }
          return result;
        }, {});
        setFilteredTimetable(filtered);
        alert("Filtered timetable loaded successfully!");
      } else {
        setError("No timetable found for the provided class.");
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      alert("You are the firstone to enter the details for the class to generate timetable. or else the className you entered might be wrong")
    }
  };

  const handleCheckFacultyTimeTable = async () => {
    const teacherIdInput = prompt("Please enter the Teacher ID to check the timetable:");
    if (!teacherIdInput) {
      setError("Please enter a valid Teacher ID to check the timetable.");
      return;
    }

    setTeacherId(teacherIdInput);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/getFacultyTimetable/${teacherIdInput}`
      );

      if (response.data?.timetables?.length > 0) {
        console.log(response.data);
        setTeacherTimetable(response.data.timetables);
        setShowTable(true); // Show table only after data is fetched
        setError("");
      } else {
        setError("No timetable found for the provided Teacher ID.");
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching faculty timetable:", error);
      setError("An error occurred while fetching the faculty timetable.");
      setShowTable(false);
    }
  };

  // Define the structure of the timetable
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "13:00-14:00", "14:00-15:00"]


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Teacher Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Teacher ID:
            <input
              type="text"
              value={teacherId}
              onChange={handleTeacherIdChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Subject:
            <input
              type="text"
              value={subject}
              onChange={handleSubjectChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Class & Section (e.g., CSIT1A):
            <input
              type="text"
              value={classSection}
              onChange={handleClassSectionChange}
              placeholder="Enter Class & Section (CSIT1A)"
              required
            />
          </label>
          {classSectionError && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {classSectionError}
            </div>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Day/Time</th>
              {hours.map((hour) => (
                <th key={hour}>{`${hour}:00 - ${hour + 1}:00`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                {hours.map((hour) => (
                  <td key={`${day}-${hour}`} style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={availability[`${day}-${hour}`] || false}
                      onChange={() => handleCheckboxChange(day, hour)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>Submit</button>
        <button type="button" onClick={handleCheckAvailability}>Check Availability</button>
        <button type="button" onClick={handleCheckFacultyTimeTable} style={{ padding: '10px 20px', fontSize: '16px' }}>Check Faculty TimeTable</button>
      </form>
      {filteredTimetable && (
  <div>
    <h3>Filtered Timetable</h3>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(filteredTimetable).map(day => (
          <React.Fragment key={day}>
            <tr>
              <td rowSpan={filteredTimetable[day].length}>{day}</td>
              <td>{filteredTimetable[day][0].time}</td>
            </tr>
            {filteredTimetable[day].slice(1).map(({ time }, index) => (
              <tr key={`${day}-${index}`}>
                <td>{time}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)}
    {showTable && teacherTimetable.length > 0 && (
  <table border="1" cellPadding="5" style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>
    <thead>
      <tr>
        <th>Day/Time</th>
        {timeSlots.map((slot) => (
          <th key={slot}>{slot}</th>
        ))}
      </tr>
    </thead>
    <tbody>
        {days.map((day) => {
          let daySchedule = timeSlots.map((slot) => {
            let classes = [];

            teacherTimetable.forEach((entry) => {
              if (entry.availability && entry.availability[day]) { // Check if day exists in availability
                entry.availability[day].forEach((time) => {
                  let formattedTime = time.replace(/\s+/g, ""); // Normalize spacing
                  let formattedSlot = slot.replace(/\s+/g, ""); // Normalize slot spacing

                  if (formattedTime === formattedSlot) {
                    classes.push(`${entry.classSection} (${entry.subject})`);
                  }
                });
              }
            });

      return classes.length > 0 ? classes.join(", ") : "-";
    });

        return (
          <tr key={day}>
            <td>{day}</td>
            {daySchedule.map((classInfo, index) => (
              <td key={timeSlots[index]}>{classInfo}</td>
            ))}
          </tr>
        );
      })}
</tbody>
  </table>
)}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TeacherPreferences;
