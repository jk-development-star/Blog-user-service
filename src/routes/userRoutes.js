import express from "express";
import { getAllUsers, register, getUserByAuthorId } from "../../handler.js";


const router = express.Router();

router.get("/getall", getAllUsers);
router.post("/register", register);
router.get('/:id',  getUserByAuthorId)


export default router;