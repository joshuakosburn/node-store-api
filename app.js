require('dotenv').config({ path: './config.env' });
require('express-async-errors');
const express = require('express');
const connectToDB = require('./db/connect');
const productsRouter = require('./routes/products');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// MIDDLEWARE
// This is here in case we want Express to handle the frontend.
// app.use(express.static('./public'));
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products</a>');
});

app.use('/api/v1/products', productsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);


// START SERVER
const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectToDB(process.env.DB_URI);
        app.listen(PORT, console.log(`[SERVER] listening on port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
}

start();