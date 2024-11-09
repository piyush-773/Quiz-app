import React, { useState } from "react";
import Lottie from "lottie-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateQuizData = () => {
        if (title === "") {
            setError("Please enter a title");
            return false;
        }
        if (description === "") {
            setError("Please enter a description");
            return false;
        }
        if (duration <= 0) {
            setError("Please enter a valid duration");
            return false;
        }
        return true;
    };

    const handleQuizCreation = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!validateQuizData()) {
            setLoading(false);
            return;
        }

        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Duration:", duration);

        try {
            const token = Cookies.get("accessToken");
            const response = await fetch(
                "http://localhost:8000/api/v1/quizes/create-quiz",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        duration,
                    }),
                }
            );

            console.log("Response Status:", response.status);
            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setSuccess("Quiz created successfully! Redirecting...");
                setTitle("");
                setDescription("");
                setDuration(0);
                console.log(data.data._id)
                setTimeout(() => navigate(`/add-questions/${data.data._id}`), 1500);
            } else {
                setError(data.message || "Failed to create quiz");
            }
        } catch (error) {
            setError("Failed to create quiz");
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl p-8 animate__animated animate__fadeInUp">
                <h2 className="text-4xl font-bold text-purple-800 mb-8">Create a Quiz</h2>
                <form onSubmit={handleQuizCreation} className="w-full max-w-sm space-y-6">
                    <div className="relative">
                        <label htmlFor="title" className="text-gray-600 font-semibold">Quiz Title:</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter quiz title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="description" className="text-gray-600 font-semibold">Description:</label>
                        <textarea
                            id="description"
                            placeholder="Enter quiz description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="duration" className="text-gray-600 font-semibold">Duration (in minutes):</label>
                        <input
                            type="number"
                            id="duration"
                            placeholder="Enter duration"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Create Quiz
                    </button>
                    {error && (
                        <p className="mt-3 text-center text-sm text-red-500 animate-pulse">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="mt-3 text-center text-sm text-green-500 animate-pulse">
                            {success}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Quiz;
