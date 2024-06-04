const express = require('express');
const bodyParser = require('body-parser');
const router = require('./application/routes/user.routes')
const connection = require('./application/config/dbConnection')
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv")
const app = express();
const port = 8000

dotenv.config({
    path: './.env'
})

app.use(cookieParser())
app.use(bodyParser.json())

connection.on('connected', () => {
    console.log("Mongoose connected to DB")
});

connection.on('error', (error) => {
    console.log("Mongoose connection Error ::", error)
});

connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
})

app.use('/user', router);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});