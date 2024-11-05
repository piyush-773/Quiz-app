import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";

const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(401, "You must be logged in to create a quiz");
    }

    if (![title, description, duration].some(field => typeof field !== "string" || !field.trim())) {

        throw new ApiError(
            400,
            "Title, description, and duration are required fields."
        );
    }

    const quiz = new Quiz({ title, description, owner, duration });
    await quiz.save();

    res.status(201).json(
        new ApiResponse(201, quiz, "Quiz successfully created!")
    );
});

const addQuestions = asyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
    const questions = req.body.questions;
});

export { createQuiz, addQuestions };
