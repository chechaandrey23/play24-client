import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {quizs, startLoadQuizs, endLoadQuizs, errorQuizs,
        quiz, startLoadQuiz, endLoadQuiz, errorQuiz,
        createQuizAttempt, startLoadCreateQuizAttempt, endLoadCreateQuizAttempt, errorCreateQuizAttempt,
        finishQuizAttempt, startLoadFinishQuizAttempt, endLoadFinishQuizAttempt, errorFinishQuizAttempt,
        checkQuiz, startLoadCheckQuiz, endLoadCheckQuiz, errorCheckQuiz,
        finishQuiz, startLoadFinishQuiz, endLoadFinishQuiz, errorFinishQuiz} from "../user.quizs";

const BASE_URL_PREFIX = 'user/api/';

interface QuizsPayload {}

function* quizsSaga(o: {[payload: string]: QuizsPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadQuizs(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quizs`,
      params: {},
    });
    console.log(res);
    yield put(quizs(res.data || []));
  } catch(e: any) {
    console.error(e);
		yield put(errorQuizs(e.data));
	} finally {
		yield put(endLoadQuizs(null));
  }
}

interface GetQuizPayload {
  quizId: string;
  attemptId?: string;
}

function* getQuizSaga(o: {[payload: string]: GetQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadQuiz(o.payload.quizId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: o.payload.attemptId
        ?`${BASE_URL_PREFIX}quiz-with-attempt/${o.payload.quizId}/${o.payload.attemptId}`
        :`${BASE_URL_PREFIX}quiz/${o.payload.quizId}`,
      params: {},
    });
    console.log(res);
    yield put(quiz(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorQuiz(e.data));
	} finally {
		yield put(endLoadQuiz(o.payload.quizId));
  }
}

interface QuizCreateAttemptPayload{
  quizId: string;
}

function* quizCreateAttemptSaga(o: {[payload: string]: QuizCreateAttemptPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadCreateQuizAttempt(o.payload.quizId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/create-attempt`,
      params: {},
      data: {},
    });
    console.log(res);
    yield put(createQuizAttempt(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorCreateQuizAttempt(e.data));
	} finally {
		yield put(endLoadCreateQuizAttempt(o.payload.quizId));
  }
}

interface QuizFinishAttemptPayload {
  quizId: string;
  attemptId: string;
}

function* quizFinishAttemptSaga(o: {[payload: string]: QuizFinishAttemptPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadFinishQuizAttempt(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/finish/${o.payload.attemptId}`,
      params: {},
      data: {},
    });
    console.log(res);
    yield put(finishQuizAttempt(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorFinishQuizAttempt(e.data));
	} finally {
		yield put(endLoadFinishQuizAttempt(null));
  }
}

interface CheckQuizPayload {
  quizId: string;
}

function* checkQuizSaga(o: {[payload: string]: CheckQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadCheckQuiz(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}fast-check-quiz/${o.payload.quizId}`,
      params: {},
    });
    console.log(res);
    yield put(checkQuiz(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorCheckQuiz(e.data));
	} finally {
		yield put(endLoadCheckQuiz(null));
  }
}

interface FinishQuizPayload {
  quizId: string;
}

function* finishQuizSaga(o: {[payload: string]: FinishQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadFinishQuiz(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/finish`,
      params: {},
      data: {},
    });
    console.log(res);
    yield put(finishQuiz(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorFinishQuiz(e.data));
	} finally {
		yield put(endLoadFinishQuiz(null));
  }
}

const USER_QUIZS = 'USER_QUIZS';
const USER_QUIZ_CREATE_ATTEMPT = 'USER_CREATE_ATTEMPT';
const USER_QUIZ_FINISH_ATTEMPT = 'USER_QUIZ_FINISH_ATTEMPT';
const USER_CHECK_QUIZ = 'USER_CHECK_QUIZ';
const USER_FINISH_QUIZ = 'USER_FINISH_QUIZ';
const USER_GET_QUIZ = 'USER_GET_QUIZ';

export const userQuizsSagas = createSagas([
  [USER_QUIZS, quizsSaga],
  [USER_QUIZ_CREATE_ATTEMPT, quizCreateAttemptSaga],
  [USER_QUIZ_FINISH_ATTEMPT, quizFinishAttemptSaga],
  [USER_CHECK_QUIZ, checkQuizSaga],
  [USER_FINISH_QUIZ, finishQuizSaga],
  [USER_GET_QUIZ, getQuizSaga],
]);

export const {sagaUserQuizs, sagaUserGetQuiz, sagaUserQuizCreateAttempt, sagaUserQuizFinishAttempt, sagaUserCheckQuiz, sagaUserFinishQuiz} = createActions({
	sagaUserQuizs: USER_QUIZS,
  sagaUserQuizCreateAttempt: USER_QUIZ_CREATE_ATTEMPT,
  sagaUserQuizFinishAttempt: USER_QUIZ_FINISH_ATTEMPT,
  sagaUserCheckQuiz: USER_CHECK_QUIZ,
  sagaUserFinishQuiz: USER_FINISH_QUIZ,
  sagaUserGetQuiz: USER_GET_QUIZ,
});
