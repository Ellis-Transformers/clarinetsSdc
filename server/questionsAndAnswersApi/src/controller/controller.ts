import * as model from "../models/models";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as types from "../models/types";

export const getHome = async (request: Request, response: Response) => {
  try {
    response.status(200).json({
      appName: process.env.npm_package_name,
      appVersion: process.env.npm_package_version,
      // description: process.env.npm_package_description
    });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};
export const getQuestionsByProduct = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const product_id: number = Number(request.body.product_id);
    const page: number = Number(request.body.page);
    const count: number = Number(request.body.count);
    const questions: Omit<types.Question, "product_id" | "asker_email">[] =
      await model.getQuestionsByProduct(product_id, page, count);
    if (questions) {
      return response.status(200).json({
        product_id: product_id,
        results: questions,
      });
    } else {
      return response
        .status(404)
        .json(`Product # ${product_id} could not be found.`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      error: error.message,
    });
  }
};

export const getAnswers = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const question_id: number = Number(request.params.product_id);
    const page: number = Number(request.query.page);
    const count: number = Number(request.query.count);
    const answers: Array<
      Omit<types.Answer, "question_id" | "answerer_email" | "reported">
    > = await model.getAnswersByQuestion(question_id, page, count);
    if (answers) {
      return response.status(200).json({
        question_Id: question_id,
        answers: answers,
      });
    } else {
      return response
        .status(404)
        .json(`Question # ${question_id} could not be found.`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      Error: error.message,
    });
  }
};

export const askQuestion = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const newQuestion = request.body;
    const postedQuestion = await model.askQuestion(newQuestion);
    if (postedQuestion) {
      return response.status(201).json(newQuestion);
    } else {
      return response.status(404).json(`Posting Question was not in correct`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      error: error.message,
    });
  }
};

//posted an answer to database
export const answerQuestion = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    console.dir(request.body);
    const newAnswer = await request.body;
    const question_id = request.params.question_id;
    const postedAnswer = await model.answerQuestion(question_id, newAnswer);
    console.dir(newAnswer);
    if (postedAnswer) {
      return response.status(201).json(newAnswer);
    } else {
      return response.status(404).json(`answer question controller broke`);
    }
  } catch (error: any) {
    return response.status(500).send({
      Status: 500,
      error: error,
      controller: "answerQuestion",
    });
  }
};
//sends a put to increase question helpful
export const updateQuestionHelpfulById = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const question_id: number = parseInt(request.params.question_id);
    const question = await model.updateQuestionHelpful(question_id);
    if (question) {
      return response.status(204).send();
    } else {
      return response
        .status(400)
        .json(`Could not update helpful on Question # ${question_id}`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      Error: error,
    });
  }
};

//sends a put to report a question
export const reportQuestionById = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    console.dir(request.params.question_id);
    const question_id: number = parseInt(request.params.question_id);
    const question = await model.reportQuestion(question_id);
    if (question) {
      return response.sendStatus(204);
    } else {
      return response
        .status(404)
        .json(`Could not report Question # ${question_id}`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      error: error.message,
    });
  }
};

//sends a put to increase answer helpful
export const updateAnswerHelpfulById = async (
  request: Request,
  response: Response
) => {
  try {
    const answer_id: number = parseInt(request.params.answer_id);
    const answer = await model.updateAnswerHelpful(answer_id);
    if (answer) {
      return response.sendStatus(204);
    } else {
      return response
        .status(404)
        .json(`Could not update helpful on Answer # ${answer_id}`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      error: error.message,
    });
  }
};

//sends a put to report an answer
export const reportAnswerById = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const answer_id: number = parseInt(request.params.answer_id);
    const answer = await model.reportAnswer(answer_id);
    if (answer) {
      return response.sendStatus(204);
    } else {
      return response
        .status(404)
        .json(` Could not report answer # ${answer_id}`);
    }
  } catch (error: any) {
    return response.status(500).json({
      Status: 500,
      error: error.message,
    });
  }
};
