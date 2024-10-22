// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env",
});

const app = express();

connectDB()
    .then(()=> {
        app.listen(process.env.PORT || 8000, ()=> {
            console.log(`Server is running on port ${process.env.PORT || 8000}`)
        })
    })
    .catch((err) => {
        console.error("MONGO db connection failed !!! ", err);
    });
