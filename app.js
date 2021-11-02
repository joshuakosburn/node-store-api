require('dotenv').config({ path: './config.env' });
const express = require('express');
const connectToDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectToDB(process.env.DB_URI);
        app.listen(PORT, console.log(`[SERVER listening on port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
}

start();