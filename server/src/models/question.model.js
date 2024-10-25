import mongoose, { Schema } from "mongoose";

const questionScehma = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: [
            
        ]
    },
    { timestamps: true });

export const Question = mongoose.model("Question", questionScehma);
