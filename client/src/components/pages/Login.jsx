import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import LoginGif from "../../assets/LoginGif.json";

const Login = ({ setLoggedIn, setProfileImage }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if (!username) {
            setError("Username is required.");
            return false;
        }
        if (!password) {
            setError("Password is required.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!validateInputs()) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/v1/users/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                Cookies.set("accessToken", data.data.accessToken);
                Cookies.set("refreshToken", data.data.refreshToken);
                setProfileImage(data.data.user.avatar);
                setLoggedIn(true);
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError(
                    data.message.includes("username")
                        ? "Username not found."
                        : data.message.includes("password")
                        ? "Password is incorrect."
                        : data.message || "An error occurred. Please try again."
                );
            }
        } catch (error) {
            setError("Login failed. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            <div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 animate__animated animate__fadeInUp">
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <Lottie animationData={LoginGif} className="w-80 md:w-96" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-purple-800 mb-8">Welcome Back</h2>
                    <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
                        <div className="relative">
                            <label htmlFor="username" className="text-gray-600 font-semibold">Username:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => { setError(""); setSuccess(""); }}
                                required
                                className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="text-gray-600 font-semibold">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => { setError(""); setSuccess(""); }}
                                required
                                className="w-full px-5 py-3 mt-2 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 border border-gray-300 transition-all duration-200 placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 top-7 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg transition-all duration-300 ${
                                loading
                                    ? "bg-purple-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                            }`}
                        >
                            {loading ? "Logging in ..." : "Login"}
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
        </div>
    );
};

export default Login;
