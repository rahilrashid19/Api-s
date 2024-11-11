const express = require("express");
const { connectDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/user");
const cookieParser = require("cookie-parser");
const { requestRouter } = require("./routes/request");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => console.log("Listening on PORT 7777"));
  })
  .catch((err) => console.log("Error connecting to Database: " + err.message));
