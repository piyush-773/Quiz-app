import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Header from "./components/pages/Header";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/UserDashboard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [profileImage, setProfileImage] = useState("");

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setLoggedIn(false);
        setProfileImage("");
    };

    useEffect(() => {
        const token = Cookies.get("accessToken");
        // const refreshToken = Cookies.get("refreshToken");
        if (token) {
            setLoggedIn(true);
            const fetchedUserData = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:8000/api/v1/users/current-user",
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );
                    if (!response.ok)
                        throw new Error("Failed to fetch user data");
                    const data = await response.json();
                    setProfileImage(data.data.avatar);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    handleLogout(); // Logout if token is invalid
                }
            };
            fetchedUserData();
        }
    }, [isLoggedIn]);

    return (
        <Router>
            <Header
                isLoggedIn={isLoggedIn}
                profileImage={profileImage}
                onLogout={handleLogout}
            />
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/about"
                    element={isLoggedIn ? <About /> : <Navigate to="/login" />}
                />
                <Route
                    path="/contact"
                    element={
                        isLoggedIn ? <Contact /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <Profile
                                isLoggedIn={isLoggedIn}
                                profileImage={profileImage}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        !isLoggedIn ? (
                            <Login
                                setLoggedIn={setLoggedIn}
                                setProfileImage={setProfileImage}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
