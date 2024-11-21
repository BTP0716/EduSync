import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherList = ({ teacher }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="card m-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/teacher/book-appointment/${teacher._id}`)}>
        <div className="card-header">
          Dr. {teacher.firstName} {teacher.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Email</b> {teacher.email}
          </p>
          <p>
            <b>Specialization</b> {teacher.specialization}
          </p>
          <p>
            <b>Experience</b> {teacher.experience}
          </p>
          <p>
            <b>Timings</b> {teacher.timings[0]} - {teacher.timings[1]}
          </p>
        </div>
      </div>
    </>
  );
};

export default TeacherList;
