const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const cookieParser = require("cookie-parser");

app.use(cookieParser());

const userRoutes = require("./routes/user");
const leaderboardRoutes = require("./routes/leaderboard");
const paragraphRoute = require("./routes/paragraphRoute");
const scoreRoute = require("./routes/scoreRoute");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/paragraph", paragraphRoute);
app.use("/api/v1/score", scoreRoute);

const { connect } = require("./config/database");
connect();

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
