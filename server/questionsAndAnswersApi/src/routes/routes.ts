import express from "express";
import { body, param, query } from "express-validator";
import * as controller from "../controller/controller";

export const router = express.Router();

router.get("/",controller.getHome);//works
router.get("/questions",controller.getQuestionsByProduct);//works
router.get("/questions/:question_id/answers",controller.getAnswers);//works
router.post("/questions",body("body").isString(),body("name").isString(),body("email").isString(),body("product_id").isInt(),controller.askQuestion);//works (when no seeding)
router.post("/questions/:question_id/answers",body("body").isString(),body("name").isString(),body("email").isString(),body("photos").isArray({ min: 0, max: 5 }),controller.answerQuestion);//works(when no seeding)
router.put("/questions/:question_id/helpful",controller.updateQuestionHelpfulById);//works
router.put("/questions/:question_id/report",controller.reportQuestionById);
router.put("/answers/:answer_id/helpful",controller.updateAnswerHelpfulById);
router.put("/answers/:answer_id/report",controller.reportAnswerById);