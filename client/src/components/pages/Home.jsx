import React, { useEffect, useState } from "react";
import QuizCard from "../pages/QuizCard"; // Adjust the import path as necessary
import axios from "axios";

function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/quizes/"
                );
                setQuizzes(response.data.data.quiz);
            } catch (err) {
                setError("Failed to fetch quizzes.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-wrap justify-center">
            {quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
            ))}
        </div>
    );
}

export default Home;
