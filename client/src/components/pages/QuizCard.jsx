import React from "react";

const QuizCard = ({ quiz }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 m-4 bg-white">
            <div className="font-bold text-xl mb-2">{quiz.title}</div>
            <p className="text-gray-700 text-base mb-4">{quiz.description}</p>
            <p className="text-gray-500 text-sm">
                Owner: {quiz.owner.username} | Duration: {quiz.duration} mins
            </p>
            <p className="text-gray-500 text-sm">
                Created At: {new Date(quiz.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default QuizCard;
