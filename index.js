const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


//create the server
const app = express();


//Connecting to the DB
connectDB();

//Enable Cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions));

//App Port
const port = process.env.PORT || 4000;

///Enable bodyparser to read the values in the body
app.use(express.json() );

//Enable public file
app.use(express.static('uploads'));

//App routes
app.use("/api/users",require('./routes/users'));
app.use("/api/auth",require('./routes/auth'));
app.use("/api/links",require('./routes/links'));
app.use("/api/files",require('./routes/files'));

//Run App
app.listen(port,'0.0.0.0', () => {
    console.log(`The server is running on the port ${port}`);
} )