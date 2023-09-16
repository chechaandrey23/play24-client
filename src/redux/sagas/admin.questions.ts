import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {questions, questionsWithSortOrder, questionsWithOutSortOrder, quiz, startLoadQuestions, endLoadQuestions, errorQuestions,
        fullQuestions, addFullQuestion, startLoadFullQuestions, endLoadFullQuestions, errorFullQuestions,
        createQuestion, addToQuestions, startLoadCreateQuestion, endLoadCreateQuestion, errorCreateQuestion,
        deleteQuestion, startLoadDeleteQuestion, endLoadDeleteQuestion, errorDeleteQuestion,
        orderQuestions, startLoadOrderQuestion, endLoadOrderQuestion, errorOrderQuestion,
        questionTypes, startLoadQuestionTypes, endLoadQuestionTypes, errorQuestionTypes,
        editQuestionDraft, startLoadEditQuestionDraft, endLoadEditQuestionDraft, errorEditQuestionDraft} from "../admin.questions";

const BASE_URL_PREFIX = 'admin/api/';

interface QuestionsPayload {
  quizId: string;
}

function* questionsSaga(o: {[payload: string]: QuestionsPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadQuestions(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/questions2`,
      params: {},
    });
    console.log(res);
    yield put(quiz(res.data));
    //yield put(questions(res.data?.questions || []));
    yield put(questionsWithSortOrder(res.data?.questions || []));
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
}

function* getQuestionSaga(o: {[payload: string]: GetQuestionPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadFullQuestions(o.payload.questionId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}quiz/${o.payload.quizId}/question/${o.payload.questionId}`,
      params: {},
    });
    console.log(res);
    yield put(addFullQuestion(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorFullQuestions(e.data));
	} finally {
		yield put(endLoadFullQuestions(o.payload.questionId));
  }
}

interface CreateQuestionPayload {
  quizId: string;
  questionTypeId: string;
  question: string;
  answerOptions?: Array<string>;
  answer?: string;
  answerArray?: Array<string>;
  draft: boolean;
}

function* createQuestionSaga(o: {[payload: string]: CreateQuestionPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadCreateQuestion(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}question-create`,
      params: {},
      data: {
        quizId: o.payload.quizId,
        questionTypeId: o.payload.questionTypeId,
        question: o.payload.question,
        ...(o.payload.answerOptions?{answerOptions: o.payload.answerOptions}:{}),
        ...(o.payload.answer?{answer: o.payload.answer}:{}),
        ...(o.payload.answerArray?{answerArray: o.payload.answerArray}:{}),
        draft: o.payload.draft,
      }
    });
    console.log(res);
    yield put(createQuestion(res.data));
    yield put(addToQuestions(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorCreateQuestion(e.data));
	} finally {
		yield put(endLoadCreateQuestion(null));
  }
}

interface DeleteQuestionPayload {
  questionId: string;
}

function* deleteQuestionSaga(o: {[payload: string]: DeleteQuestionPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadDeleteQuestion(o.payload.questionId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}question-delete`,
      params: {},
      data: {
        id: o.payload.questionId,
      },
    });
    console.log(res);
    yield put(deleteQuestion(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorDeleteQuestion(e.data));
	} finally {
		yield put(endLoadDeleteQuestion(o.payload.questionId));
  }
}

interface OrderQuestionPayload {
  id: string;
  order: number;
}

interface OrderQuestionsPayload {
  quizId: string;
  orderQuestions: Array<OrderQuestionPayload>;
}

function* orderQuestionsSaga(o: {[payload: string]: OrderQuestionsPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadOrderQuestion(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}order-questions`,
      params: {},
      data: {
        quizId: o.payload.quizId,
        orderQuestions: o.payload.orderQuestions
      },
    });
    console.log(res);
    //yield put(orderQuestions(res.data));
    yield put(questionsWithSortOrder(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorOrderQuestion(e.data));
	} finally {
		yield put(endLoadOrderQuestion(null));
  }
}

function* questionTypesSaga({payload = {}}): Generator<any, any, any> {
  try {
    yield put(startLoadQuestionTypes(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}question-types`,
      params: {},
    });
    console.log(res);
    yield put(questionTypes(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorQuestionTypes(e.data));
  } finally {
    yield put(endLoadQuestionTypes(null));
  }
}

interface EditQuestionDraftPayload {
  questionId: string;
  draft: boolean;
}

function* editQuestionDraftSaga(o: {[payload: string]: EditQuestionDraftPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadEditQuestionDraft(o.payload.questionId));

    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}question-edit/draft`,
      params: {},
      data: {
        id: o.payload.questionId,
        draft: o.payload.draft,
      },
    });
    console.log(res);
    yield put(editQuestionDraft(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorEditQuestionDraft(e.data));
	} finally {
		yield put(endLoadEditQuestionDraft(o.payload.questionId));
  }
}

const ADMIN_QUESTIONS = 'ADMIN_QUESTIONS';
const ADMIN_GET_QUESTION = 'ADMIN_GET_QUESTION';
const ADMIN_CREATE_QUESTION = 'ADMIN_CREATE_QUESTION';
const ADMIN_DELETE_QUESTION = 'ADMIN_DELETE_QUESTION';
const ADMIN_ORDER_QUESTIONS = 'ADMIN_ORDER_QUESTIONS';
const ADMIN_QUESTION_TYPES = 'ADMIN_QUESTION_TYPES';
const ADMIN_EDIT_QUESTION_DRAFT = 'ADMIN_EDIT_QUESTION_DRAFT';

export const adminQuestionsSagas = createSagas([
  [ADMIN_QUESTIONS, questionsSaga],
  [ADMIN_GET_QUESTION, getQuestionSaga],
  [ADMIN_CREATE_QUESTION, createQuestionSaga],
  [ADMIN_DELETE_QUESTION, deleteQuestionSaga],
  [ADMIN_ORDER_QUESTIONS, orderQuestionsSaga],
  [ADMIN_QUESTION_TYPES, questionTypesSaga],
  [ADMIN_EDIT_QUESTION_DRAFT, editQuestionDraftSaga],
]);

export const {sagaAdminQuestions, sagaAdminGetQuestion, sagaAdminCreateQuestion,
              sagaAdminDeleteQuestion, sagaAdminOrderQuestions, sagaAdminQuestionTypes,
              sagaAdminEditQuestionDraft} = createActions({
	sagaAdminQuestions: ADMIN_QUESTIONS,
  sagaAdminGetQuestion: ADMIN_GET_QUESTION,
  sagaAdminCreateQuestion: ADMIN_CREATE_QUESTION,
  sagaAdminDeleteQuestion: ADMIN_DELETE_QUESTION,
  sagaAdminOrderQuestions: ADMIN_ORDER_QUESTIONS,
  sagaAdminQuestionTypes: ADMIN_QUESTION_TYPES,
  sagaAdminEditQuestionDraft: ADMIN_EDIT_QUESTION_DRAFT,
});
