import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: [
        {
            type: String,
            required: true,
        },
    ],
    answer: {
        type: String,
        required: true,
    },
    questionImage: {
        type: String,
        default: null,
    },
});

export const Question = mongoose.model("Question", questionSchema);
