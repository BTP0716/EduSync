const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const teacherModel = require("../models/teacherModel");
const appointmentModel = require("../models/appointmentModel");
const nodemailer = require('nodemailer')
//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// mail sender detail
let transporter = nodemailer.createTransport({
  secure: true,
  service: 'gmail',
  auth: {
      user: process.env.MAIL_USERNAME_VERIFY,
      pass: process.env.MAIL_PASSWORD_VERIFY
  },
  tls: {
      rejectedUnauthorized: false
    }
});


// APpply TEACHER CTRL
const applyTeacherController = async (req, res) => {
  try {
    console.log(req.body)
    const newTeacher = await teacherModel({ ...req.body, status: "pending" });
    await newTeacher.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const email_admin= adminUser.email;
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-teacher-request",
      message: `${newTeacher.firstName} ${newTeacher.lastName} Has Applied For A Teacher Account`,
      data: {
        teacherId: newTeacher._id,
        name: newTeacher.firstName + " " + newTeacher.lastName,
        onClickPath: "/admin/teachers",
      },
    });

    var mailoptions = {
      from: `New Notification :<${process.env.MAIL_USERNAME_VERIFY}>`,
      to: email_admin,
      subject: 'New application for teacher approval',
      html: `<h1>A new teacher approval has arrived please check into your EduSync account </h1>`
      }
 //send mail
    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
          console.log("Error " + error);
      } else {
          console.log("Email sent successfully");
      }
          });
    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
    res.status(201).send({
      success: true,
      message: "Teacher Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Teacher",
    });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

//GET ALL Teacher
const getAllTeachersController = async (req, res) => {
  try {
    const teachers = await teacherModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Teacher Lists Fetched Successfully",
      data: teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching Teacher",
    });
  }
};

//BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.teacherInfo.userId });
    const email_teacher= user.email;

    user.notifcation.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    var mailoptions = {
      from: `New Notification :<${process.env.MAIL_USERNAME_VERIFY}>`,
      to: email_teacher,
      subject: 'New application for teacher appointment',
      html: `<h1>A new time slot approval request has arrived from 
      ${req.body.userInfo.name}, ${req.body.userInfo.email}, ${req.body.userInfo.time}  
      please check into your EduSync account </h1>`
      }
 //send mail
    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
          console.log("Error " + error);
      } else {
          console.log("Email sent successfully");
      }
          });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyTeacherController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllTeachersController,
  bookeAppointmnetController,
};
