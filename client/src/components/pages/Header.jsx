import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, profileImage, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    const handleLogout = () => {
        onLogout();
        setDropdownOpen(false);
    };
    return (
        <header className="m-0 p-5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 h-[70px] flex justify-between items-center">
            <div className="logo">
                <Link to="/">
                    <p className="text-xl">Quiz-app</p>
                </Link>
            </div>
            <div className="navItem">
                <ul className="flex justify-between items-center">
                    <li className="mr-5">
                        <Link to="/" className="text-lg">
                            Home
                        </Link>
                    </li>
                    <li className="mr-5">
                        <Link to="/about" className="text-lg">
                            About
                        </Link>
                    </li>
                    <li className="mr-5">
                        <Link to="/contact" className="text-lg">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="menu flex items-center relative">
                {isLoggedIn ? (
                    <div className="flex gap-5">
                        <div className="">
                            <Link to="/create-quiz">
                                <button className="border border-red-500 p-2 rounded-3xl bg-gradient-to-r font-bold text-white cursor-pointer via-pink-500 to-purple-500">
                                    Create Quiz
                                </button>
                            </Link>
                        </div>
                        <div className="relative inline-block">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={handleDropdownToggle}
                                // onMouseLeave={handleDropdownToggle}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 bg-white shadow-md mt-1 rounded">
                                    <Link to="/profile">Profile</Link>
                                    <button onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/Login">
                            <button className="text-lg mr-5">Login</button>
                        </Link>
                        <Link to="/Signup">
                            <button className="text-lg">Signup</button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
