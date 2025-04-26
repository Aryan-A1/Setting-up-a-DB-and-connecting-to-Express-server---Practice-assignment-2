const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { resolve } = require("path");
const User = require("./schema");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(bodyParser.json());
app.use(express.static("static"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Routes
app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

// POST API endpoint for user creation
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: `Validation error: ${error.message}` });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
