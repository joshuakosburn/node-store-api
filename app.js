require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, console.log(`[SERVER listening on port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
}

start();