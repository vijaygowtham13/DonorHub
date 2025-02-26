const userModel = require("../models/userModel");

//Get Donar-list
const getDonarsListController = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: donarData.length,
      message: "Donar List Fetched Successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar List API",
      error,
    });
  }
};

const getHospitalsListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Hospital List API",
      error,
    });
  }
};

const getOrganisationsListController = async (req, res) => {
  try {
    const organisationData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: organisationData.length,
      message: "Organisation List Fetched Successfully",
      organisationData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Organisation List API",
      error,
    });
  }
};

// controllers for deleting

const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Donar Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Donar API",
      error,
    });
  }
};

const deleteHospitalController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Hospital Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Hospital API",
      error,
    });
  }
};

const deleteOrganisationController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Organisation Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Hospital API",
      error,
    });
  }
};

module.exports = {
  getDonarsListController,
  getHospitalsListController,
  getOrganisationsListController,
  deleteDonarController,
  deleteHospitalController,
  deleteOrganisationController,
};
