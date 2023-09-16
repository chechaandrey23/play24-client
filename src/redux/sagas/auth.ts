import {take, call, put, select, delay} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {createSagas, createActions} from './rootSaga';

import {request} from './helpers/helper.request';
import {defaultRequestSettings} from './helpers/helper.default.request.settings';

import {login, startLoadLogin, endLoadLogin, errorLogin,
        logout, startLoadLogout, endLoadLogout, errorLogout,
        user, startLoadUser, endLoadUser, errorUser} from "../auth";

const BASE_URL_PREFIX = '/auth/api/';

interface LoginPayload {
  username: string;
  password: string;
}

function* loginSaga(o: {[payload: string]: LoginPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadLogin(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}login`,
      params: {},
      data: {
        username: o.payload.username,
        password: o.payload.password,
      },
    });
    console.log(res);
    yield put(user(res.data));
    yield put(login(true));
    yield put(logout(false));
  } catch(e: any) {
    console.error(e);
		yield put(errorLogin(e.data));
	} finally {
		yield put(endLoadLogin(null));
  }
}

interface LogoutPayload {
  fullExit: boolean;
}

function* logoutSaga(o: {[payload: string]: LogoutPayload}): Generator<any, any, any> {
  try {
    yield put(startLoadLogout(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'POST',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}logout`,
      params: {},
      data: {
        fullExit: o.payload.fullExit,
      },
    });
    console.log(res);
    yield put(user(null));
    yield put(login(false));
    yield put(logout(true));
  } catch(e: any) {
    console.error(e);
		yield put(errorLogout(e.data));
	} finally {
		yield put(endLoadLogout(null));
  }
}

function authStateChangedChannel(): any {
  const subscribe = (emitter: any) => {
    defaultRequestSettings.JWTRefreshUpdateFn = (res: any): void => {
      emitter.call(null, res || null);
    }
  	return () => {
			defaultRequestSettings.JWTRefreshUpdateFn = undefined as any;
		}
	};
	return eventChannel(subscribe);
}

function* authStateChangedSaga(): Generator<any, any, any> {
	const channel = yield call(authStateChangedChannel);

	while (true) {
    const res = yield take(channel);
    console.log(res);
    if(res.data) {
      // user change state
      yield put(user(res.data));
      yield put(login(true));
      yield put(logout(false));
    } else {
      // logout
      yield put(user(null));
      yield put(logout(true));
      yield put(login(false));
    }
	}
}

function* getUserSaga({payload = {}}): Generator<any, any, any> {
  try {
    yield put(startLoadUser(null));
    const res: any = yield call(request, {
      ...defaultRequestSettings,
      method: 'GET',
      responseType: 'json',
      url: `${BASE_URL_PREFIX}user`,
      params: {},
    });
    console.log(res);
    yield put(login(true));
    yield put(logout(false));
    yield put(user(res.data));
  } catch(e: any) {
    console.error(e);
		yield put(errorUser(e.data));
	} finally {
		yield put(endLoadUser(null));
  }
}

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const GET_USER = 'GET_USER';

export const authSagas = createSagas([
  [LOGIN, loginSaga],
  [LOGOUT, logoutSaga],
  [GET_USER, getUserSaga],
  authStateChangedSaga,
]);

export const {sagaLogin, sagaLogout, sagaGetUser} = createActions({
	sagaLogin: LOGIN,
  sagaLogout: LOGOUT,
  sagaGetUser: GET_USER,
});
