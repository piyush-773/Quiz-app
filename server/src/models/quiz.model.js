import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        duration: {
            type: Number, // Duration in minutes for the quiz
            required: true,
        },
        isLive: {
            type: Boolean,
            default: true, // Indicates if the quiz is live
        },
        startTime: {
            type: Date, // Start time for live quizzes
            default: null,
        },
        endTime: {
            type: Date, // End time for live quizzes
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
