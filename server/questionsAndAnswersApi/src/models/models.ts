import { db } from "../utils/db.server";
import * as types from "./types"

//gets all questions for a specific product_id
export const getQuestionsByProduct = async(
  product_id: number,
  page:number,
  count:number
  ): Promise<Array<Omit<types.Question, "product_id" | "asker_email">>> => {
  return await db.questions.findMany({
    skip: ((page - 1) * count),
    take: count,
    select: {
      id: true,
      body: true,
      date_written: true,
      asker_name: true,
      helpful: true,
      reported: true
    },
    where: {
      reported: false,
      product_id: product_id
    },
    orderBy: {
      helpful: "desc"
    },
  });
};

//gets all the answers for a specific question_id
export const getAnswersByQuestion = async(
  question_id: number,
  page: number,
  count: number
  ): Promise<Array<Omit<types.Answer, "question_id" | "answerer_email" | "reported">>> => {
  return await db.answers.findMany({
    skip: ((page - 1) * count),
    take: count,
    select: {
      id: true,
      body: true,
      date_written: true,
      answerer_name: true,
      helpful: true,
      Photos:{
        select: {
          id: true,
          url: true
        }
      }
    },
    where: {
      reported: false,
      question_id,
    },
    orderBy: {
      helpful: "desc"
    }
  });
};

//creates a question entry that gets posted to the database
export const askQuestion = async(
  newQuestion:{
    product_id:number,
    email:string,
    name:string,
    body:string
  }): Promise<types.Question> => {
  const {product_id, email, name, body} = newQuestion;
  const date = Date.now();
  return await db.questions.create({
    data: {
      product_id,
      body,
      asker_email: email,
      asker_name: name,
      date_written: date
    }
  })
};

//creates entires in the answers table of the database
export const answerQuestion = async(
  question_id:string,
  newAnswer:{
    body: string,
    name: string,
    email: string,
    photos:string[]|[]
  }): Promise<unknown> => {
    const {body, name, email, photos} = newAnswer;
    const listOfPhotos = photos.map((photo:string)=> {
      return {url:photo}
    });
    return await db.answers.create({
      data: {
        question_id: Number(question_id),
        body,
        date_written: BigInt(Date.now()),
        answerer_name: name,
        answerer_email: email,
        Photos: {
          createMany: {
            data: listOfPhotos
          }
        }
      },
      select: {
        id: true,
        question_id: true,
        body: true,
        date_written: true,
        answerer_name: true,
        answerer_email: true,
        reported: true,
        helpful: true,
        Photos: {
          select: {
            id: true,
            answer_id: true,
            url: true
          }
        }
      }
    });
}

// increments the value of helpful in a question when passed a question_id
export const updateQuestionHelpful = async (question_id: number):
Promise<unknown> => {
  return await db.questions.update({
    where: {
      id: question_id
    },
    data: {
      helpful:{ increment: 1}
    },
    select: {
      id: true,
      body: true,
      date_written: true,
      asker_name: true,
      helpful: true,
      reported: true
    }
  })
};

//sets reported to true for a specified question
export const reportQuestion = async (question_id: number):
Promise<unknown> => {
  return await db.questions.update({
    where:{
      id: question_id
    },
    data:{
      reported:true
    }
  })
};

//increments the value of helpful in an answer when passed an answer_id
export const updateAnswerHelpful = async (answer_id: number):
Promise<unknown> => {
  return await db.answers.update({
    where: {
      id: answer_id
    },
    data: {
      helpful: {increment: 1}
    }
  })
};

//sets reported to true for a specific answer
export const reportAnswer = async (answer_id: number):
Promise<unknown> => {
  return await db.answers.update({
    where: {
      id: answer_id
    },
    data: {
      reported:true
    }
  })
};