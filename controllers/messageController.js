// File: controllers/messageController.js
const utilities = require("../utilities");
const messageModel = require("../models/message-model");
const accountModel = require("../models/account-model");

const messageController = {
  async inbox(req, res) {
    const messages = await messageModel.getMessagesByRecipient(res.locals.accountData.account_id);
    const nav = await utilities.getNav();
    res.render("account/inbox", { title: "Inbox", messages, nav });
  },

  async archived(req, res) {
    const messages = await messageModel.getArchivedMessages(res.locals.accountData.account_id);
    const nav = await utilities.getNav();
    res.render("account/archived", { title: "Archived Messages", messages, nav });
  },

  async view(req, res) {
    const message = await messageModel.getMessageById(req.params.id);
    if (message.recipient_id !== res.locals.accountData.account_id) return res.redirect("/account/inbox");
    await messageModel.markAsRead(message.id);
    const nav = await utilities.getNav();
    res.render("account/viewMessage", { title: message.subject, message, nav });
  },

  async archive(req, res) {
    await messageModel.archiveMessage(req.params.id);
    res.redirect("/messages/inbox");
  },

  async delete(req, res) {
    await messageModel.deleteMessage(req.params.id);
    res.redirect("/messages/inbox");
  },

  async replyForm(req, res) {
    const original = await messageModel.getMessageById(req.params.id);
    const nav = await utilities.getNav();
    res.render("account/reply", { title: "Reply to " + original.sender_email, original, nav });
  },

  async sendReply(req, res) {
    const { subject, message_content } = req.body;
    const original = await messageModel.getMessageById(req.params.id);
    await messageModel.sendMessage(
      res.locals.accountData.account_firstname,
      res.locals.accountData.account_email,
      original.recipient_id,
      subject,
      message_content,
      original.id
    );
    req.flash("notice", "Reply sent successfully");
    res.redirect("/messages/inbox");
  },

  async newMessageForm(req, res) {
    try {
      const allAccounts = await accountModel.getAllAccounts();
      const filteredAccounts = allAccounts.filter(
        (acc) => acc.account_id !== res.locals.accountData.account_id
      );
      const nav = await utilities.getNav();
      res.render("account/newMessage", {
        title: "New Message",
        accounts: filteredAccounts,
        nav,
        message: req.flash("notice"),
      });
    } catch (err) {
      console.error("Error loading message form:", err);
      const nav = await utilities.getNav();
      res.render("account/newMessage", {
        title: "New Message",
        accounts: [],
        nav,
        message: "Error loading accounts",
      });
    }
  },

  async sendNewMessage(req, res) {
    try {
      const { recipient_id, subject, message_content } = req.body;
      const senderName = res.locals.accountData.account_firstname;
      const senderEmail = res.locals.accountData.account_email;

      await messageModel.sendMessage(
        senderName,
        senderEmail,
        recipient_id,
        subject,
        message_content
      );

      req.flash("notice", "Message sent successfully.");
      res.redirect("/messages/new");
    } catch (err) {
      console.error("Error sending message:", err);
      req.flash("notice", "Error sending message.");
      res.redirect("/messages/new");
    }
  }

};

module.exports = messageController;