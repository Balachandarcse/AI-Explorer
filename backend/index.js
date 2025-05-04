const express = require("express");
const mdb = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const User=require("./models/User");
const ToolModel=require("./models/Tool");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mdb.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => {
        console.error("Couldn't connect to DB:", err);
        process.exit(1);
    });

app.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", isvalid: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", isvalid: false });
    }
});

app.get('/tool/:id', async (req, res) => {
  const { id } = req.params;
  const tool = await ToolModel.findById(id);
  if (!tool) return res.status(404).json({ isvalid: false, message: "Tool not found" });

  res.json({ isvalid: true, data: tool });
});


app.get("/availableTools",async(req,res)=>{
  try{
    const tools= await ToolModel.find().sort({ name: 1 });
    return res.status(200).json({message:"tools fetched successfully",isvalid:true,data:tools});
  }catch(e){
    return res.status(400).json({ message: "Server error", isvalid: false });
  }
  
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", isvalid: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", isvalid: false });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Login successful",
            token,
            isvalid: true,
            user: { firstname: user.firstname, lastname: user.lastname, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", isvalid: false });
    }
});

  
app.post("/tools", async (req, res) => {
  let { name, description, link, category, logo, youtubeUrl } = req.body;

  name = name.trim();
  description = description.trim();
  link = link.trim();
  category = category.trim();
  logo = logo.trim();
  youtubeUrl = youtubeUrl ? youtubeUrl.trim() : ""; // youtubeUrl is optional

  if (!name || !description || !link || !category || !logo || !youtubeUrl) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    const existingTool = await ToolModel.findOne({ name: name, link: link });
    if (existingTool) {
      return res.status(409).json({ error: "Tool already exists" });
    }

    const newTool = new ToolModel({ 
      name, 
      description, 
      link, 
      category, 
      logo,
      youtubeUrl
    });

    await newTool.save();
    res.status(201).json({ message: "Tool added successfully", tool: newTool });
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  
  

app.put("/tools/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, link, category, logo, youtubeUrl } = req.body;

  // Trim fields to remove any extra spaces
  name = name.trim();
  description = description.trim();
  link = link.trim();
  category = category.trim();
  logo = logo.trim();
  youtubeUrl = youtubeUrl ? youtubeUrl.trim() : ""; // youtubeUrl is optional, but if provided, it should be trimmed.

  // Check if all required fields are provided
  if (!name || !description || !link || !category || !logo || !youtubeUrl) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    // Check if a tool with the same name and link already exists (excluding the current tool)
    const existing = await ToolModel.findOne({ name, link, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ error: "Another tool with the same name and link exists" });
    }

    // Update the tool with the new information
    const updatedTool = await ToolModel.findByIdAndUpdate(
      id,
      { name, description, link, category, logo, youtubeUrl },  // Include youtubeUrl here
      { new: true, runValidators: true }
    );

    // Check if the tool was found and updated
    if (!updatedTool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // Send the updated tool data in the response
    res.status(200).json({ message: "Tool updated successfully", tool: updatedTool });
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  

  app.delete("/tools/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTool = await ToolModel.findByIdAndDelete(id);
  
      if (!deletedTool) {
        return res.status(404).json({ message: "Tool not found" });
      }
  
      res.status(200).json({ message: "Tool deleted successfully", tool: deletedTool });
    } catch (error) {
      console.error("DELETE Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // GET /categories - return list of unique categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await ToolModel.distinct("category");
    res.status(200).json({ categories, isvalid: true });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", isvalid: false });
  }
});

// GET /toolsByCategory/:category - return tools by category
app.get("/toolsByCategory/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const tools = await ToolModel.find({ category });
    res.status(200).json({ tools, isvalid: true });
  } catch (error) {
    console.error("Error fetching tools by category:", error);
    res.status(500).json({ message: "Server error", isvalid: false });
  }
});

app.get("/tools/search", async (req, res) => {
  const { query } = req.query;

  try {
    // Search for tools whose name or description contains the search query (case-insensitive)
    const tools = await ToolModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Match tool names (case-insensitive)
        { description: { $regex: query, $options: "i" } } // Match tool descriptions
      ]
    });

    if (tools.length > 0) {
      return res.status(200).json({ isvalid: true, data: tools });
    } else {
      return res.status(404).json({ isvalid: false, message: "No tools found" });
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ isvalid: false, message: "Server error" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
