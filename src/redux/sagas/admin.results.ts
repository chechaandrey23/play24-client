import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {results, startLoadResults, endLoadResults, errorResults,
        resetResult, startLoadResetResult, endLoadResetResult, errorResetResult} from "../admin.results";

const BASE_URL_PREFIX = 'admin/api/';

interface ResultsPayload {
  quizId: string;
}

function* resultsSaga(o: {[payload: string]: ResultsPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadResults(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}result-quiz/${o.payload.quizId}`,
      params: {},
    });
    console.log(res);
    yield put(results(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorResults(e.data));
	} finally {
		yield put(endLoadResults(null));
  }
}

interface ResetResultPayload {
  quizId: string;
  userId: string;
  attemptId: string;
}

function* resetResultSaga(o: {[payload: string]: ResetResultPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadResetResult(o.payload.attemptId));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}reset-result-quiz`,
      params: {},
      data: {
        quizId: o.payload.quizId,
        userId: o.payload.userId,
        attemptId: o.payload.attemptId,
      }
    });
    console.log(res);
    yield put(resetResult(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorResetResult(e.data));
	} finally {
		yield put(endLoadResetResult(o.payload.attemptId));
  }
}

const ADMIN_RESULTS = 'ADMIN_RESULTS';
const ADMIN_RESET_RESULT = 'ADMIN_RESET_RESULT';

export const adminResultsSagas = createSagas([
  [ADMIN_RESULTS, resultsSaga],
  [ADMIN_RESET_RESULT, resetResultSaga],
]);

export const {sagaAdminResults, sagaAdminResetResult} = createActions({
	sagaAdminResults: ADMIN_RESULTS,
  sagaAdminResetResult: ADMIN_RESET_RESULT,
});
