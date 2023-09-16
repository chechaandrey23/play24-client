import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {serverDateTimeZone, startLoadServerDateTimeZone, endLoadServerDateTimeZone, errorServerDateTimeZone,
        setDiffHours} from "../server.date.time.zone";

const BASE_URL_PREFIX = 'auth/api/';

function* getServerDateTimeZoneSaga({payload = {}}): Generator<any, any, any> {
  try {
    yield put(startLoadServerDateTimeZone(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}server-time-zone`,
      params: {},
    });
    console.log(res);
    yield put(serverDateTimeZone(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorServerDateTimeZone(e.data));
	} finally {
		yield put(endLoadServerDateTimeZone(null));
  }
}

const GET_SERVER_DATE_TIME_ZONE = 'GET_SERVER_DATE_TIME_ZONE';

export const serverDateTimeZoneSagas = createSagas([
  [GET_SERVER_DATE_TIME_ZONE, getServerDateTimeZoneSaga],
]);

export const {sagaServerDateTimeZone} = createActions({
	sagaServerDateTimeZone: GET_SERVER_DATE_TIME_ZONE,
});
