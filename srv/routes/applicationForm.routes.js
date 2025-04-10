const express = require("express");
const router = express.Router();

const applicationFormController = require("../controllers/applicationForm.controller")

router.get("/getClassList", applicationFormController.getClassList);
router.get("/getElectiveList", applicationFormController.getElectiveList);
router.post("/createUser", applicationFormController.createUser);

module.exports = router;
