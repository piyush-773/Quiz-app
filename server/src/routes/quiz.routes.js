import { Router } from "express";
import {
    createQuiz,
    addQuestions,
    getAllQuiz,
} from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllQuiz);
router.route("/create-quiz").post(verifyJWT, createQuiz);
router.route("/:quizId/add-questions").post(verifyJWT, upload.single("questionImage"), addQuestions);
export default router;
