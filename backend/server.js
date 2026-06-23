const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://typing-website-khaki.vercel.app/",
    credentials: true,
  })
);

app.use(cookieParser());

// Database Connection
const { connect } = require("./config/database");
connect();

// Routes
const userRoutes = require("./routes/user");
const leaderboardRoutes = require("./routes/leaderboard");
const paragraphRoute = require("./routes/paragraphRoute");
const scoreRoute = require("./routes/scoreRoute");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/paragraph", paragraphRoute);
app.use("/api/v1/score", scoreRoute);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});