import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Lottie from "lottie-react";
import register from "../../assets/register.json";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [fullName, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors = {};

        if (!fullName) newErrors.fullName = "Full name is required.";
        if (!username) newErrors.username = "Username is required.";
        if (username.length < 4)
            newErrors.username = "Username must be at least 4 characters.";

        if (!email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Email is invalid.";

        if (!password) newErrors.password = "Password is required.";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e, setImageFunction, field) => {
        const file = e.target.files[0];
        const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (file) {
            if (validImageTypes.includes(file.type)) {
                setImageFunction(file);
                setError((prevError) => ({ ...prevError, [field]: "" }));
            } else {
                setImageFunction(null);
                setError((prevError) => ({
                    ...prevError,
                    [field]:
                        "Only image files are allowed (JPEG, PNG, GIF, WEBP).",
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setLoading(true);

        if (!validateFields()) {
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);
        if (coverImage) formData.append("coverImage", coverImage);

        try {
            const response = await fetch(
                "http://localhost:8000/api/v1/users/register",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                Cookies.set("accessToken", data.data.accessToken);
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError((prevError) => ({
                    ...prevError,
                    form:
                        data.message ||
                        "Registration failed. Please try again.",
                }));
            }
        } catch (err) {
            setError((prevError) => ({
                ...prevError,
                form: "Network error. Please try again later.",
            }));
            console.error("Error:", err);
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                <div className="md:w-1/2 p-6 flex justify-center items-center bg-purple-50">
                    <Lottie animationData={register} className="w-full h-80" />
                </div>
                <div className="md:w-1/2 p-6 md:p-10 h-full">
                    <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
                        Sign Up
                    </h2>
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="fullname"
                                    className="text-gray-600 font-semibold"
                                >
                                    Full Name:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullname(e.target.value);
                                        setError((prevError) => ({
                                            ...prevError,
                                            fullName: "",
                                        }));
                                    }}
                                    required
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none"
                                />
                                {error.fullName && (
                                    <p className="text-red-500 text-sm">
                                        {error.fullName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="username"
                                    className="text-gray-600 font-semibold"
                                >
                                    Username:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    required
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError((prevError) => ({
                                            ...prevError,
                                            username: "",
                                        }));
                                    }}
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none"
                                />
                                {error.username && (
                                    <p className="text-red-500 text-sm">
                                        {error.username}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-gray-600 font-semibold"
                                >
                                    Email:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError((prevError) => ({
                                            ...prevError,
                                            email: "",
                                        }));
                                    }}
                                    required
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none"
                                />
                                {error.email && (
                                    <p className="text-red-500 text-sm">
                                        {error.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="avatar"
                                    className="text-gray-600 font-semibold"
                                >
                                    Profile Image:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    id="avatar"
                                    onChange={(e) =>
                                        handleFileChange(e, setAvatar, "avatar")
                                    }
                                    className="w-full mt-1"
                                    required
                                />
                                {error.avatar && (
                                    <p className="text-red-500 text-sm">
                                        {error.avatar}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="coverImage"
                                    className="text-gray-600 font-semibold"
                                >
                                    Cover Image:
                                </label>
                                <input
                                    type="file"
                                    id="coverImage"
                                    onChange={(e) =>
                                        handleFileChange(
                                            e,
                                            setCoverImage,
                                            "coverImage"
                                        )
                                    }
                                    className="w-full mt-1"
                                />
                                {error.coverImage && (
                                    <p className="text-red-500 text-sm">
                                        {error.coverImage}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="text-gray-600 font-semibold"
                                >
                                    Password:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError((prevError) => ({
                                            ...prevError,
                                            password: "",
                                        }));
                                    }}
                                    required
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none"
                                />
                                {error.password && (
                                    <p className="text-red-500 text-sm">
                                        {error.password}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-gray-600 font-semibold"
                                >
                                    Confirm Password:{" "}
                                    <span className="text-red-500 text-xl">
                                        <sup>*</sup>
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError((prevError) => ({
                                            ...prevError,
                                            confirmPassword: "",
                                        }));
                                    }}
                                    required
                                    className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none"
                                />
                                {error.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {error.confirmPassword}
                                    </p>
                                )}
                            </div>
                            {error.form && (
                                <p className="text-red-500 text-center mt-2">
                                    {error.form}
                                </p>
                            )}
                            {success && (
                                <p className="text-green-500 text-center mt-2">
                                    {success}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-all duration-200 ${loading && "cursor-not-allowed opacity-50"}`}
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
