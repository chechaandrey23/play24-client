import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {quizs, startLoadQuizs, endLoadQuizs, errorQuizs,
        addFullQuiz, fullQuizs, startLoadFullQuizs, endLoadFullQuizs, errorFullQuizs,
        createQuiz, addToQuizs, startLoadCreateQuiz, endLoadCreateQuiz, errorCreateQuiz,
        deleteQuiz, startLoadDeleteQuiz, endLoadDeleteQuiz, errorDeleteQuiz,
        editQuizDraft, startLoadEditQuizDraft, endLoadEditQuizDraft, errorEditQuizDraft} from "../admin.quizs";

const BASE_URL_PREFIX = 'admin/api/';

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
    yield put(quizs(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorQuizs(e.data));
	} finally {
		yield put(endLoadQuizs(null));
  }
}

interface GetQuizPayload {
  quizId: string;
}

function* getQuizSaga(o: {[payload: string]: GetQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadFullQuizs(o.payload.quizId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}`,
      params: {},
    });
    console.log(res);
    yield put(addFullQuiz(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorFullQuizs(e.data));
	} finally {
		yield put(endLoadFullQuizs(o.payload.quizId));
  }
}

interface CreateQuizPayload {
  quizname: string;
  draft: boolean;
  description: string;
  duration: number;
  numberOfAttempts: number;
}

function* createQuizSaga(o: {[payload: string]: CreateQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadCreateQuiz(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz-create`,
      params: {},
      data: {
        quizname: o.payload.quizname,
        draft: o.payload.draft,
        description: o.payload.description,
        duration: o.payload.duration,
        numberOfAttempts: o.payload.numberOfAttempts,
      }
    });
    console.log(res);
    yield put(createQuiz(res.data));
    yield put(addToQuizs(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorCreateQuiz(e.data));
	} finally {
		yield put(endLoadCreateQuiz(null));
  }
}

interface DeleteQuizPayload {
  quizId: string;
}

function* deleteQuizSaga(o: {[payload: string]: DeleteQuizPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadDeleteQuiz(o.payload.quizId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz-delete`,
      params: {},
      data: {
        id: o.payload.quizId,
      },
    });
    console.log(res);
    yield put(deleteQuiz(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorDeleteQuiz(e.data));
	} finally {
		yield put(endLoadDeleteQuiz(o.payload.quizId));
  }
}

interface EditQuizDraftPayload {
  quizId: string;
  draft: boolean;
}

function* editQuizDraftSaga(o: {[payload: string]: EditQuizDraftPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadEditQuizDraft(o.payload.quizId));

    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz-edit/draft`,
      params: {},
      data: {
        id: o.payload.quizId,
        draft: o.payload.draft,
      },
    });
    console.log(res);
    yield put(editQuizDraft(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorEditQuizDraft(e.data));
	} finally {
		yield put(endLoadEditQuizDraft(o.payload.quizId));
  }
}

const ADMIN_QUIZS = 'ADMIN_QUIZS';
const ADMIN_CREATE_QUIZ = 'ADMIN_CREATE_QUIZ';
const ADMIN_DELETE_QUIZ = 'ADMIN_DELETE_QUIZ';
const ADMIN_EDIT_QUIZ_DRAFT = 'ADMIN_EDIT_QUIZ_DRAFT';
const ADMIN_GET_QUIZ = 'ADMIN_GET_QUIZ';

export const adminQuizsSagas = createSagas([
  [ADMIN_QUIZS, quizsSaga],
  [ADMIN_CREATE_QUIZ, createQuizSaga],
  [ADMIN_DELETE_QUIZ, deleteQuizSaga],
  [ADMIN_EDIT_QUIZ_DRAFT, editQuizDraftSaga],
  [ADMIN_GET_QUIZ, getQuizSaga],
]);

export const {sagaAdminQuizs, sagaAdminCreateQuiz, sagaAdminDeleteQuiz, sagaAdminEditQuizDraft, sagaAdminGetQuiz} = createActions({
	sagaAdminQuizs: ADMIN_QUIZS,
  sagaAdminCreateQuiz: ADMIN_CREATE_QUIZ,
  sagaAdminDeleteQuiz: ADMIN_DELETE_QUIZ,
  sagaAdminEditQuizDraft: ADMIN_EDIT_QUIZ_DRAFT,
  sagaAdminGetQuiz: ADMIN_GET_QUIZ,
});
