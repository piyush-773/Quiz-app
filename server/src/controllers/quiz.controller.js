import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

const getAllQuiz = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;

    let filter = {};
    if (query) {
        filter = {
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        };
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const totalQuiz = await Quiz.countDocuments(filter);
    const quiz = await Quiz.find(filter)
        .populate("owner", "fullName email username")
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const pagination = {
        totalQuiz,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQuiz / limit),
    };

    res.status(200).json(
        new ApiResponse(200, { quiz, pagination }, "Quiz fetched successfully")
    );
});

const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(401, "You must be logged in to create a quiz");
    }

    if (
        ![title, description, duration].some(
            (field) => typeof field !== "string" || !field.trim()
        )
    ) {
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
    const userId = req.user?._id;

    if (!isValidObjectId(quizId)) {
        throw new ApiError(400, "Invalid Quiz ID");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(
            400,
            "Questions are required and should be in array format"
        );
    }

    // Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    if(quiz.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to add questions to this quiz");
    }
    // Process each question
    const questionDocs = await Promise.all(
        questions.map(async (q, index) => {
            const { question, options, answer } = q;

            if (!question) {
                throw new ApiError(400, "Each question requires text");
            }
            if(!Array.isArray(options)){
                throw new ApiError(400, "Options should be in array format");
            }
            if (!answer) {
                throw new ApiError(400, "Correct answer is required");
            }

            // Handle image upload for each question if provided
            let questionImageUrl = null;
            if (req.files && req.files[`questionImage${index}`]) {
                const imagePath = req.files[`questionImage${index}`][0].path;
                const uploadResult = await uploadOnCloudinary(imagePath);
                questionImageUrl = uploadResult.url;
            }

            // Create question document
            const questionDoc = new Question({
                quiz: quizId,
                question,
                options,
                answer,
                image: questionImageUrl,
            });

            await questionDoc.save();
            return questionDoc._id;
        })
    );

    // Add question IDs to the quiz
    quiz.questions = quiz.questions.concat(questionDocs);
    await quiz.save();

    res.status(201).json(
        new ApiResponse(
            201,
            { questions: questionDocs },
            "Questions successfully added to the quiz"
        )
    );
});

export { createQuiz, addQuestions, getAllQuiz };
