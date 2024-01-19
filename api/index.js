const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express();

// middlewares
app.use(express.json())

// database connection
mongoose.connect(process.env.DBURL)
    .then(() => console.log("connected to DataBase"))
    .catch((error) => {
        console.log(`Error occure in Database Connection : ${error}`)
    })

    
app.listen(process.env.PORT, () => {
    console.log(`server is running on port 3000 `);
})