import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
        question: String,
        options: Array,
        answer: String,
    },
    {
        timestamps: true,
    }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
