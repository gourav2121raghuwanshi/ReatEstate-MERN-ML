const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const path = require('path');
const userroute = require('./routes/userRoute.js')
const authRouter = require('./routes/authRoute.js');
const listingRouter = require('./routes/listingRouter.js');
require('dotenv').config();
const cors = require('cors');

mongoose.connect(process.env.DBURL)
  .then(() => console.log("connected to DataBase"))
  .catch((error) => {
    console.log(`Error occure in Database Connection : ${error}`)
  })

__dirname = path.resolve();

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors());
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
})
app.use('/api/user', userroute);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});



