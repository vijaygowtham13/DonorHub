const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  getDonarsListController,
  getHospitalsListController,
  getOrganisationsListController,
  deleteDonarController,
  deleteHospitalController,
  deleteOrganisationController,
} = require("../controllers/adminController");

const router = express.Router();

//GET || DONAR LIST
router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonarsListController
);

//GET || HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalsListController
);

//GET || ORGANISATION LIST
router.get(
  "/organisation-list",
  authMiddleware,
  adminMiddleware,
  getOrganisationsListController
);

// routes for deleting

//Delete || donars
router.delete(
  "/delete-donar/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonarController
);

//Delete || hospitals
router.delete(
  "/delete-hospital/:id",
  authMiddleware,
  adminMiddleware,
  deleteHospitalController
);

//Delete || hospitals
router.delete(
  "/delete-organisation/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrganisationController
);

module.exports = router;
