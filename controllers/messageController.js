// File: controllers/messageController.js
const Message = require("../models/message-model");

const MessageController = {
  async inbox(req, res) {
    const messages = await Message.getMessagesByRecipient(res.locals.accountData.account_id);
    res.render("account/inbox", { title: "Inbox", messages });
  },

  async archived(req, res) {
    const messages = await Message.getArchivedMessages(res.locals.accountData.account_id);
    res.render("account/archived", { title: "Archived Messages", messages });
  },

  async view(req, res) {
    const message = await Message.getMessageById(req.params.id);
    if (message.recipient_id !== res.locals.accountData.account_id) return res.redirect("/account/inbox");
    await Message.markAsRead(message.id);
    res.render("account/viewMessage", { title: message.subject, message });
  },

  async archive(req, res) {
    await Message.archiveMessage(req.params.id);
    res.redirect("/account/inbox");
  },

  async delete(req, res) {
    await Message.deleteMessage(req.params.id);
    res.redirect("/account/inbox");
  },

  async replyForm(req, res) {
    const original = await Message.getMessageById(req.params.id);
    res.render("account/reply", { title: "Reply to " + original.subject, original });
  },

  async sendReply(req, res) {
    const { subject, message_content } = req.body;
    const original = await Message.getMessageById(req.params.id);
    await Message.sendMessage(
      res.locals.accountData.account_firstname,
      res.locals.accountData.account_email,
      original.recipient_id,
      subject,
      message_content,
      original.id
    );
    res.redirect("/account/inbox");
  }
};

module.exports = MessageController;