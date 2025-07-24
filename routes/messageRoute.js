// File: routes/messageRoute.js
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const messageController = require("../controllers/messageController");
// console.log("Available messageController functions:", Object.keys(messageController));
console.log("Available functions:", Object.keys(messageController));

router.get("/inbox", utilities.checkJWTToken, messageController.inbox);
router.get("/archived", utilities.checkJWTToken, messageController.archived);
router.get("/view/:id", utilities.checkJWTToken, messageController.view);
router.post("/archive/:id", utilities.checkJWTToken, messageController.archive);
router.post("/delete/:id", utilities.checkJWTToken, messageController.delete);
router.get("/reply/:id", utilities.checkJWTToken, messageController.replyForm);
router.post("/reply/:id", utilities.checkJWTToken, messageController.sendReply);
router.get("/new", utilities.checkJWTToken, messageController.newMessageForm);
router.post("/new", utilities.checkJWTToken, messageController.sendNewMessage);

module.exports = router;