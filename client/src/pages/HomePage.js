import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row } from "antd";
import TecacherList from "../components/TeacherList";
const HomePage = () => {
  const [teachers, setTeachers] = useState([]);
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllTeachers",{ headers: {Authorization: "Bearer " + localStorage.getItem("token"),},});
      if (res.data.success) {
        setTeachers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Row>
        {teachers && teachers.map((teacher) => <TecacherList teacher={teacher} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;
