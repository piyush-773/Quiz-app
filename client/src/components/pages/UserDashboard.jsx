import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import Profiler from "../../assets/coverImage.gif";

const UserDashboard = ({ isLoggedIn, profileImage, onLogout }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token && isLoggedIn) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:8000/api/v1/users/current-user",
                        {
                            method: "GET",
                            headers: { Authorization: `Bearer ${token}` },
                            credentials: "include",
                        }
                    );
                    if (!response.ok) throw new Error(response.statusText);
                    const userData = await response.json();
                    setProfile(userData.data);
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                }
            };
            fetchUserData();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col items-center w-full h-full bg-gray-50">
            {profile ? (
                profile.coverImage ? (
                    <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-56 object-cover shadow-md mb-6"
                    />
                    
                ) : (
                    <img
                        src={Profiler}
                        alt="Cover Placeholder"
                        className="w-full h-56 object-cover shadow-md mb-6"
                    />
                )
            ) : (
                <img
                    src={Profiler}
                    alt="Cover Placeholder"
                    className="w-full h-56 object-cover shadow-md mb-6"
                />
            )}

            <div className="max-w-4xl w-full px-4">
                {profileImage && (
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="rounded-full w-32 h-32 border-4 border-white shadow-lg mx-auto -mt-16"
                    />
                )}

                {profile ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-8 text-center">
                        <h3 className="text-2xl font-semibold mb-2">
                            Hello, {profile.fullName}
                        </h3>
                        <p className="text-gray-500">Username: {profile.username}</p>
                        <p className="text-gray-500">Email: {profile.email}</p>
                        <h4 className="text-xl font-semibold mt-6">Quiz History</h4>
                        {profile.watchHistory && profile.watchHistory.length > 0 ? (
                            <ul className="mt-4 text-gray-700">
                                {profile.watchHistory.map((quiz, index) => (
                                    <li key={index} className="py-2 border-b">
                                        {quiz}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-4">
                                No quiz history available
                            </p>
                        )}
                        <button
                            onClick={onLogout}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
