import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,
            required: true,
            default: "default-avatar.png",
        },
        coverImage: {
            type: String,
            default: "default-cover.jpg",
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Quiz",
            },
        ],
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin", "quiz_creator"],
            default: "user",
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

const payload = {
    _id: this.id,
    email: this.email,
    username: this.username,
    fullname: this.fullname,
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 23);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

userSchema.methods.generateRefreshToken = function () {
    jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export const User = mongoose.model("User", userSchema);
