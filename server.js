import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
// import connectDB from './src/config/db.config.js'
// const DATABASE_URL = process.env.DATABASE_URL;
import { errorHandler } from './src/middleware/errorHandler.js';
import createHttpError from 'http-errors';
import userRoutes from './src/routes/userRoutes.js'
// import handler from './handler.js'

const PORT = process.env.PORT || 3003
const corsOptions = {
    origin: "http://localhost:3000",
};
const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions))
// app.use(handler)

app.use('/api/v1.0/blogsite/user', userRoutes)

// connectDB(DATABASE_URL)
/** Error Handler */
app.use((req, res, next) => {
    next(createHttpError(404, 'Request URL not found'));
});

app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
