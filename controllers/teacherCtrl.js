const teacherModel = require("../models/teacherModel");
const getTeacherInfoController = async (req, res) => {
  try {
    const teacher = await teacherModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "teacher data fetch success",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Teacher Details",
    });
  }
};

// update teacher profile
const updateProfileController = async (req, res) => {
  try {
    const teacher = await teacherModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Teacher Profile Updated",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Teacher Profile Update issue",
      error,
    });
  }
};

//get single teacher
const getTeacherByIdController = async (req, res) => {
  try {
    const teacher = await teacherModel.findOne({ _id: req.body.teacherId });
    res.status(200).send({
      success: true,
      message: "Sigle TEACHER Info Fetched",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single teacher info",
    });
  }
};

module.exports = {
  getTeacherInfoController,
  updateProfileController,
  getTeacherByIdController,
};
