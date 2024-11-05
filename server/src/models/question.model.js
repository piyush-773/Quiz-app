import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: (v) => v.length >= 2,
                message: "There must be at least 2 options.",
            },
        },
        answer: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
