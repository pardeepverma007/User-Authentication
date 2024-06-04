const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/userauth";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.error("Database connection ERROR", err);
});

module.exports = mongoose.connection;