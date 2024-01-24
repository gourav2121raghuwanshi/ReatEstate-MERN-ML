const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');



const userroute = require('./routes/userRoute.js')
const authRouter = require('./routes/authRoute.js');
const listingRouter = require('./routes/listingRouter.js');

// middlewares
app.use(express.json())
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

// database connection
mongoose.connect(process.env.DBURL)
    .then(() => console.log("connected to DataBase"))
    .catch((error) => {
        console.log(`Error occure in Database Connection : ${error}`)
    })



app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})

app.use('/api/user', userroute);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.get("/", (req, res) => {
    res.send("<h1>Hey there</h1>");
  });

  
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
});
