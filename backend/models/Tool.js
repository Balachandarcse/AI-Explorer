const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
  category: String,
  logo:String,
  youtubeUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tool", ToolSchema);
