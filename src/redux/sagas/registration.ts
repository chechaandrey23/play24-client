import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {registration, startLoadRegistration, endLoadRegistration, errorRegistration,
        roles, startLoadRoles, endLoadRoles, errorRoles} from "../registration";
import {user, login, logout} from '../auth';

const BASE_URL_PREFIX = '/auth/api/';

interface RegistrationPayload {
  username: string;
  password: string;
  roles: Array<string>;
}

function* registrationSaga(o: {[payload: string]: RegistrationPayload}): Generator<any, any, any> {
	try {
		yield put(startLoadRegistration(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}registration`,
      params: {},
      data: {
        username: o.payload.username,
        password: o.payload.password,
        roles: o.payload.roles
      },
    });
    console.log(res);
    yield put(user(res.data));
    yield put(login(true));
    yield put(logout(false));
    yield put(registration(true));
	} catch(e: any) {
		console.error(e);
		yield put(errorRegistration(e.data));
	} finally {
		yield put(endLoadRegistration(null));
	}
}

function* getAllRolesSaga({payload = {}}): Generator<any, any, any> {
  try {
    yield put(startLoadRoles(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}roles`,
      params: {},
    });
    console.log(res);
    yield put(roles(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorRoles(e.data));
  } finally {
    yield put(endLoadRoles(null));
  }
}

const REGISTRATION = 'REGISTRATION';
const GET_ALL_ROLES = 'GET_ALL_ROLES';

export const registrationSagas = createSagas([
  [REGISTRATION, registrationSaga],
  [GET_ALL_ROLES, getAllRolesSaga],
]);

export const {sagaRegistration, sagaGetAllRoles} = createActions({
	sagaRegistration: REGISTRATION,
  sagaGetAllRoles: GET_ALL_ROLES,
});
