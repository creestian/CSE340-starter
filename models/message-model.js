// File: models/message-model.js
const pool = require("../database");

const messageModel = {
  async getMessagesByRecipient(recipientId) {
    const sql = `SELECT * FROM messages WHERE recipient_id = $1 AND is_archived = false ORDER BY created_at DESC`;
    const result = await pool.query(sql, [recipientId]);
    return result.rows;
  },

  async getArchivedMessages(recipientId) {
    const sql = `SELECT * FROM messages WHERE recipient_id = $1 AND is_archived = true ORDER BY created_at DESC`;
    const result = await pool.query(sql, [recipientId]);
    return result.rows;
  },

  async getMessageById(id) {
    const sql = `SELECT m.*, a.account_email AS sender_email
                FROM messages m
                JOIN account a ON m.sender_email = a.account_email
                WHERE m.id = $1`;
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  },

  async markAsRead(id) {
    const sql = `UPDATE messages SET is_read = true WHERE id = $1`;
    return pool.query(sql, [id]);
  },

  async archiveMessage(id) {
    const sql = `UPDATE messages SET is_archived = true WHERE id = $1`;
    return pool.query(sql, [id]);
  },

  async deleteMessage(id) {
    const sql = `DELETE FROM messages WHERE id = $1`;
    return pool.query(sql, [id]);
  },

  async sendMessage(senderName, senderEmail, recipientId, subject, messageContent, replyToId = null) {
    const sql = `INSERT INTO messages (sender_name, sender_email, recipient_id, subject, message_content, reply_to_id)
                 VALUES ($1, $2, $3, $4, $5, $6)`;
    return pool.query(sql, [senderName, senderEmail, recipientId, subject, messageContent, replyToId]);
  }
};

module.exports = messageModel;