const mongoose = require('mongoose');

const users = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
});

module.exports = mongoose.models.users || mongoose.model("users",users);