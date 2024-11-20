import React from "react";
import { Card, Typography } from "antd";
import img  from "../assets/user.jpg";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Profileuser = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "50%",
          padding: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
            Profile Information
          </Title>
        {/* Left Section: Image */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <img
            src={img} // Anonymous placeholder image
            alt="User Avatar"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Section: User Info */}
        <div style={{ flex: "2", paddingLeft: "20px" }}>
          
          <Text strong>Name:</Text> <Text>{user.name}</Text>
          <br />
          <Text strong>Email:</Text> <Text>{user.email}</Text>
          <br />
          <Text strong>Role:</Text>{" "}
          <Text>{user.isAdmin ? "Admin" : user.isTeacher ? "Teacher" : "User"}</Text>
        </div>
      </Card>
    </div>
  );
};

export default Profileuser;
