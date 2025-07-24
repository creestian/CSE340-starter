// File: routes/messageRoute.js
const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");
const Utilities = require("../utilities/");

router.get("/inbox", Utilities.checkLogin, MessageController.inbox);
router.get("/archived", Utilities.checkLogin, MessageController.archived);
router.get("/view/:id", Utilities.checkLogin, MessageController.view);
router.post("/archive/:id", Utilities.checkLogin, MessageController.archive);
router.post("/delete/:id", Utilities.checkLogin, MessageController.delete);
router.get("/reply/:id", Utilities.checkLogin, MessageController.replyForm);
router.post("/reply/:id", Utilities.checkLogin, MessageController.sendReply);

module.exports = router;