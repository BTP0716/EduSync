import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { message } from "antd";
import { Card, Button, Row, Col } from "antd";
import Layout from "../components/Layout";
const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user)
    console.log(user)
    const fetchAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/user/get-appointment", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(res)
            if (res.data.success) {
                setAppointments(res.data.appointments);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong while fetching appointments.");
        }
    };
    const handleconfirm = async (e, id) => {
        try {
            const res = await axios.patch(`/api/v1/user/confirm-appointment/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(res)
            if (res.data.success) {
                message.success("request approved");
                fetchAppointments();
            } else {
                message.error("some error occured");
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong while fetching appointments.");
        }
    }
    const handledelete = async (e, id) => {
        try {
            const res = await axios.patch(`/api/v1/user/delete-appointment/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                message.success("request rejected");
                fetchAppointments();
            } else {
                message.error("some error occured");
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong while fetching appointments.");
        }
    }
    useEffect(() => {
        fetchAppointments();
    }, []);
    // Filter appointments based on user role
    const bookedByUser = appointments.filter(app => app.userId === user?._id);
    const receivedByTeacher = appointments.filter(app => app.teacherId === user?._id);

    return (

        <Layout>
            <div style={{ padding: "20px" }}>

                {user?.isTeacher && (
                    <>
                        {/* Section: Booked by this teacher */}
                        < h2 > Appointments Booked By You</h2>
                        <div style={{ display: "flex", flexDirection: "column", height: "200px", overflowY: "scroll", overflowX: "hidden" }}>
                            <Row gutter={[16, 16]}>
                                {bookedByUser.map(appointment => (
                                    <Col key={appointment._id} xs={24} sm={12} md={8}>
                                        <Card
                                            title={`Date: ${appointment.date}`}
                                            extra={<strong><span>Status: {appointment.status}</span></strong>}
                                        >
                                            <p>Time: {appointment.time}</p>
                                            <p>Teacher Email: {appointment?.teacherData?.email}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        {/* Section: Appointments received */}
                        <h2>Appointments Received</h2>
                        <div style={{ display: "flex", flexDirection: "column", height: "200px", overflowY: "scroll", overflowX: "hidden" }}>
                            <Row gutter={[16, 16]}>
                                {receivedByTeacher.map(appointment => (
                                    <Col key={appointment._id} xs={24} sm={12} md={8}>
                                        <Card
                                            title={`Date: ${appointment.date}`}
                                            extra={<strong><span>Status: {appointment.status}</span></strong>}
                                        >
                                            <p>Time: {appointment.time}</p>
                                            <p>User Email: {appointment?.userData?.email}</p>
                                            {appointment.status === "pending" && <Button onClick={(e) => handleconfirm(e, appointment._id)} type="primary">Approve</Button>}
                                            &nbsp; &nbsp; &nbsp;
                                            {appointment.status === "pending" && <Button onClick={(e) => handledelete(e, appointment._id)} type="primary" danger>Reject</Button>}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                )}

                {/* Section: Admin/User */}
                {!user?.isTeacher && (
                    <>
                        <h2>Appointments Booked By You</h2>
                        <div style={{ display: "flex", flexDirection: "column", height: "500px", overflowY: "scroll", overflowX: "hidden" }}>
                            <Row gutter={[16, 16]}>
                                {bookedByUser.map(appointment => (
                                    <Col key={appointment._id} xs={24} sm={12} md={8}>
                                        <Card
                                            title={`Date: ${appointment.date}`}
                                            extra={<strong><span>Status: {appointment.status}</span></strong>}
                                        >
                                            <p>Time: {appointment.time}</p>
                                            <p>Teacher Email: {appointment?.teacherData?.email}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                )}
            </div >
        </Layout >

    )
};

export default Appointments;
