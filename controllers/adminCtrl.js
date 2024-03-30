const teacherModel = require("../models/teacherModel");
const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};

const getAllTeachersController = async (req, res) => {
  try {
    const teachers = await teacherModel.find({});
    res.status(200).send({
      success: true,
      message: "Teachers Data list",
      data: teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting teachers data",
      error,
    });
  }
};

// teacher account status
const changeAccountStatusController = async (req, res) => {
  try {
    const { teacherId, status } = req.body;
    const teacher = await teacherModel.findByIdAndUpdate(teacherId, { status });
    const user = await userModel.findOne({ _id: teacher.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "teacher-account-request-updated",
      message: `Your Teacher Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isTeacher = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllTeachersController,
  getAllUsersController,
  changeAccountStatusController,
};
