const express = require("express");
const mdb = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const User=require("./models/User");
const ToolModel=require("./models/Tool");
const Admin=require("./models/Admin")
const nodemailer = require("nodemailer");

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

// app.post('/insert-all', async (req, res) => {
//   try {
//     const aiToolsData=req.body;
//     const insertedTools = [];
//     const skippedTools = [];

//     for (const tool of aiToolsData) {
//       const exists = await ToolModel.findOne({ name: tool.name });
//       if (exists) {
//         skippedTools.push(tool.name);
//         continue;
//       }
//       const newTool = new ToolModel(tool);
//       await newTool.save();
//       insertedTools.push(tool.name);
//     }

//     res.status(201).json({
//       success: true,
//       inserted: insertedTools.length,
//       skipped: skippedTools.length,
//       duplicates: skippedTools,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
  
app.post("/tools", async (req, res) => {
  let { name, description, link, category, logo, youtubeUrl } = req.body;

  name = name.trim();
  description = description.trim();
  link = link.trim();
  category = category.trim();
  logo = logo.trim();
  youtubeUrl = youtubeUrl ? youtubeUrl.trim() : ""; 

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
  let { name, description, link, category, logo, youtubeUrl } = req.body;

  name = name.trim();
  description = description.trim();
  link = link.trim();
  category = category.trim();
  logo = logo.trim();
  youtubeUrl = youtubeUrl ? youtubeUrl.trim() : ""; 
  if (!name || !description || !link || !category || !logo || !youtubeUrl) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    const existing = await ToolModel.findOne({ name, link, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ error: "Another tool with the same name and link exists" });
    }

    const updatedTool = await ToolModel.findByIdAndUpdate(
      id,
      { name, description, link, category, logo, youtubeUrl }, 
      { new: true, runValidators: true }
    );

    if (!updatedTool) {
      return res.status(404).json({ message: "Tool not found" });
    }

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
  
app.get("/categories", async (req, res) => {
  try {
    const categories = await ToolModel.distinct("category");
    res.status(200).json({ categories, isvalid: true });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", isvalid: false });
  }
});

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
    const tools = await ToolModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, 
        { description: { $regex: query, $options: "i" } } 
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
 
app.post("/admin", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const nAdmin = new Admin({ name, email, password: hashedPassword });
    await nAdmin.save();

    return res.status(200).json({ message: "ok" });
  } catch (e) {
    console.error("Admin error:", e.message);
    return res.status(500).json({ message: "Internal error for admin" });
  }
});

app.post("/admin-login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "User not found", isvalid: false });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", isvalid: false });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Login successful",
            token,
            isvalid: true,
            admin: { name: admin.name, email: admin.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", isvalid: false });
    }
});


app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASS,       
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
