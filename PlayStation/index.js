const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

//DB Connect
mongoose
  .connect(process.env.CONNECTION_URL)

  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server ON, port: ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
