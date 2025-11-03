const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.error("MongoDB error:", err));
