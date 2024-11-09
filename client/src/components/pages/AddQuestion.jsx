import React, { useState } from "react";
import Lottie from "lottie-react";
import Cookies from "js-cookie";
import UploadGif from "../../assets/register.json"; // Assuming you have an upload animation
import { useParams, useNavigate } from "react-router-dom";

const AddQuestion = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([{ text: "", correct: false }, { text: "", correct: false }, { text: "" }, { text: "" }]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { quizId } = useParams();
    const navigate = useNavigate();

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index].text = event.target.value;
        setOptions(newOptions);
    };

    const handleCorrectOptionChange = (index) => {
        const newOptions = options.map((option, idx) => ({
            ...option,
            correct: idx === index,
        }));
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { text: "", correct: false }]);
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (question === "" || options.some(opt => opt.text === "")) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const token = Cookies.get("accessToken");
        const formData = new FormData();
        
        // Format the data as per the required structure
        formData.append(`questions[0][question]`, question);
        options.forEach((opt, index) => {
            formData.append(`questions[0][options][${index}]`, opt.text);
            if (opt.correct) {
                formData.append(`questions[0][answer]`, opt.text);
            }
        });

        if (image) {
            formData.append("questionImage", image);
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/quizes/${quizId}/add-questions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Question added successfully! Redirecting...");
                setTimeout(() => {
                    setQuestion("");
                    setOptions([{ text: "", correct: false }, { text: "", correct: false }, { text: "" }, { text: "" }]);
                    setImage(null);
                    setImagePreview(null);
                    navigate("/");
                }, 2000);
            } else {
                setError(data.message || "Failed to add question");
            }
        } catch (error) {
            setError("Failed to add question");
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            <div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 animate__animated animate__fadeInUp">
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Lottie animationData={UploadGif} className="w-80 md:w-96" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-purple-800 mb-8">Add a Question</h2>
                    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                        <div className="relative">
                            <label htmlFor="question" className="text-gray-600 font-semibold">Question:</label>
                            <input
                                type="text"
                                name="question"
                                id="question"
                                placeholder="Enter question here"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                                required
                            />
                        </div>
                        {options.map((option, index) => (
                            <div key={index} className="relative">
                                <label htmlFor={`option-${index}`} className="text-gray-600 font-semibold">Option {index + 1}:</label>
                                <input
                                    type="text"
                                    name={`option-${index}`}
                                    id={`option-${index}`}
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e)}
                                    className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                                    required
                                />
                                <label>
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        checked={option.correct}
                                        onChange={() => handleCorrectOptionChange(index)}
                                    />
                                    Correct
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Add Option
                        </button>
                        <div className="relative">
                            <label htmlFor="questionImage" className="text-gray-600 font-semibold">Upload Image (optional):</label>
                            <input
                                type="file"
                                name="questionImage"
                                id="questionImage"
                                onChange={handleImageUpload}
                                className="w-full mt-2"
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg transition-all duration-300 ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"}`}
                        >
                            {loading ? "Adding Question..." : "Add Question"}
                        </button>
                        {error && (
                            <p className="mt-3 text-center text-sm text-red-500 animate-pulse">{error}</p>
                        )}
                        {success && (
                            <p className="mt-3 text-center text-sm text-green-500 animate-pulse">{success}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
