const userModel = require("../models/userModel");
const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      // throw new Error("User not found!");
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.inventoryType == "out") {
      if (user.role !== "hospital") {
        return res.status(404).send({
          success: false,
          message: "Not a hospital account",
        });
      }

      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate blood quantity
      const totalInOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalIn = totalInOfRequestedBloodGroup[0]?.total || 0;

      //Calculate out blood quantity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      // In & Out Calculation
      const availableQuantityOfBloodGroup = totalIn - totalOut;

      // If empty
      if (availableQuantityOfBloodGroup === 0) {
        return res.status(500).send({
          success: false,
          message: `Currently ${requestedBloodGroup.toUpperCase()} blood is not available`,
        });
      }
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantity) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ml of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      if (user.role !== "donar") {
        return res.status(404).send({
          success: false,
          message: "Not a donar account",
        });
      }
      req.body.donar = user?._id;
    }

    // save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    res.status(201).send({
      success: true,
      message: "New Blood Record added",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Inventory API",
      error,
    });
  }
};

const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "retrieved all records successfully",
      inventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Inventory API",
      error,
    });
  }
};

const getDonarController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    const donarId = await inventoryModel.distinct("donar", {
      organisation,
    });
    const donars = await userModel.find({ _id: { $in: donarId } });
    return res.status(200).send({
      success: true,
      message: "Donar records retrieved successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Donar API",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    if (!hospitalId) {
      return res.status(404).send({
        success: false,
        message: "hospital not found",
      });
    }
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "hospitals fetched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
      error,
    });
  }
};

const getOrganisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donar });
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Organisation fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Organisation API",
      error,
    });
  }
};

const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Hospital Org fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital Org API",
      error,
    });
  }
};

const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "retrieved hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Consumer Inventory API",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
};
