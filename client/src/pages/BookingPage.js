import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [teachers, setTeachers] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const dispatch = useDispatch();

  // Fetch teacher data by ID
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/teacher/getTeacherById",
        { teacherId: params.teacherId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setTeachers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle booking functionality
  const handleBooking = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          teacherId: teachers.userId,
          userId: user._id,
          teacherInfo: teachers,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {teachers && (
          <div>
            <h4>
              Dr. {teachers.firstName} {teachers.lastName}
            </h4>
            <h4>
              Timings: {teachers.timings && teachers.timings[0]} -{" "}
              {teachers.timings && teachers.timings[1]}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) =>
                  setDate(moment(value).format("DD-MM-YYYY"))
                }
              />
              <label htmlFor="time" className="m-2">
                Select Time:
              </label>
              <input
                type="time"
                id="time"
                className="form-control m-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
