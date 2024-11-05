import { Router } from "express";
import { createQuiz, addQuestions } from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/create-quiz").post(
    verifyJWT,
    createQuiz
)

export default router;