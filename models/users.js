const mongoose = require('mongoose');

const users = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    wins: { type: Number, default: 0 }
});

module.exports = mongoose.models.users || mongoose.model("users", users);