import Users from "./src/models/users.js";
import { validationError, emailConflictError } from './src/middleware/errorHandler.js';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './src/config/db.config.js'
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL)

export const register = async (event) => {
    const input = JSON.parse(event.body);
    let { user_name, email, password, user_type } = input;
    user_type = user_type === undefined ?  "user": user_type;
    const dataOne = { user_name, email, password, user_type };
    console.log("dataOne", dataOne);
    try {
        const user = await Users.create(dataOne);
        if (user) {
            const dataTwo = {
                "user_id": user._id,
                "user_name": user.user_name,
                "email": user.email,
                "password": user.password,
                "user_type": user.user_type
            };
            const auth = await axios.post('https://s37wiuolsj.execute-api.us-east-1.amazonaws.com/dev/api/v1.0/blogsite', dataTwo);
            if(auth){
                return { statusCode: 201, body: JSON.stringify({ message: "User created successfully!" }) };
            }
        }
        return { statusCode: 201, body: JSON.stringify({ message: "User created successfully!" }) };
    } catch (error) {
        if (error.name === 'ValidationError') {
            return { statusCode: 400, body: JSON.stringify({ message:validationError(error) }) };
        }
        if (error.code === 11000) {
            return { statusCode: 409, body: JSON.stringify({ message:emailConflictError(error) }) };
        }
        console.log("Error", error.message);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error!"}) };
    }
};

export const getAllUsers = async (event) => {
    try {
        const users = await Users.find({}, { __v: 0 })
        if (users) {
            return { statusCode: 200, body: JSON.stringify({ message: "Users fetch successfully!"}) };
        } else {
            return { statusCode: 200, body: JSON.stringify({ message: "No user found!"}) };
        }
    } catch (error) {
        console.log("Error", error.message);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error"}) };
    }
};

