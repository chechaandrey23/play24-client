import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {questions, replaceQuestion, questionsWithSortOrder, questionsWithOutSortOrder, startLoadQuestions, endLoadQuestions, errorQuestions,
        currentQuestion, startLoadCurrentQuestion, endLoadCurrentQuestion, errorCurrentQuestion,
        editCurrentQuestion, startLoadEditCurrentQuestion, endLoadEditCurrentQuestion, errorEditCurrentQuestion,
        fullQuiz, fullQuizQuestions, fullQuizQuestionsWithSortOrder, fullQuizQuestionsWithOutSortOrder, fullQuizQuestion,
        replaceFullQuizQuestion, startLoadFullQuiz, endLoadFullQuiz, errorFullQuiz} from "../user.questions";

const BASE_URL_PREFIX = '/user/api/';

interface QuestionsPayload {
  quizId: string;
  attemptId: string;
}

function* questionsSaga(o: {[payload: string]: QuestionsPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadQuestions(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/questions/${o.payload.attemptId}`,
      params: {},
    });
    console.log(res);
    //yield put(questions(res.data));
    yield put(questionsWithSortOrder(res.data || []));
  } catch(e: any) {
    console.error(e);
		yield put(errorQuestions(e.data));
	} finally {
		yield put(endLoadQuestions(null));
  }
}

interface GetQuestionPayload {
  quizId: string;
  questionId: string;
  attemptId: string;
}

function* getQuestionSaga(o: {[payload: string]: GetQuestionPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadCurrentQuestion(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/question/${o.payload.questionId}/${o.payload.attemptId}`,
      params: {},
    });
    console.log(res);
    yield put(currentQuestion(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorCurrentQuestion(e.data));
	} finally {
		yield put(endLoadCurrentQuestion(null));
  }
}

interface SetQuestionPayload {
  quizId: string;
  questionId: string;
  attemptId: string;
  answer?: string;
  answerArray?: Array<string>;
}

function* setQuestionSaga(o: {[payload: string]: SetQuestionPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadEditCurrentQuestion(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/question/${o.payload.questionId}/${o.payload.attemptId}`,
      params: {},
      data: {
        ...(o.payload.answer?{answer: o.payload.answer}:{}),
        ...(o.payload.answerArray?{answerArray: o.payload.answerArray}:{}),
      }
    });
    console.log(res);
    yield put(editCurrentQuestion(res.data));
    //yield put(replaceQuestion(res.data));
    yield put(replaceFullQuizQuestion(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorEditCurrentQuestion(e.data));
	} finally {
		yield put(endLoadEditCurrentQuestion(null));
  }
}

interface fullQuizPayload {
  quizId: string;
  attemptId: string;
  questionId?: string;
}

function* fullQuizSaga(o: {[payload: string]: fullQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadFullQuiz(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/questions2/${o.payload.attemptId}`,
      params: {},
    });
    console.log(res);
    yield put(fullQuiz(res.data));
    yield put(fullQuizQuestionsWithSortOrder(res.data.questions || []));
    if(o.payload.questionId) yield put(fullQuizQuestion(res.data.questions.find((entry: any) => entry._id == o.payload.questionId)));
  } catch(e: any) {
    console.error(e);
		yield put(errorFullQuiz(e.data));
	} finally {
		yield put(endLoadFullQuiz(null));
  }
}

const USER_QUESTIONS = 'USER_QUESTIONS';
const USER_GET_QUESTION = 'USER_GET_QUESTION';
const USER_SET_QUESTION = 'USER_SET_QUESTION';
const USER_FULL_QUIZ = 'USER_FULL_QUIZ';

export const userQuestionsSagas = createSagas([
  [USER_QUESTIONS, questionsSaga],
  [USER_GET_QUESTION, getQuestionSaga],
  [USER_SET_QUESTION, setQuestionSaga],
  [USER_FULL_QUIZ, fullQuizSaga],
]);

export const {sagaUserQuestions, sagaUserGetQuestion, sagaUserSetQuestion, sagaUserFullQuiz} = createActions({
	sagaUserQuestions: USER_QUESTIONS,
  sagaUserGetQuestion: USER_GET_QUESTION,
  sagaUserSetQuestion: USER_SET_QUESTION,
  sagaUserFullQuiz: USER_FULL_QUIZ,
});
