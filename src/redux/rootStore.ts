import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";

import authReduser from './auth';
import registrationReduser from './registration';
import userQuizsReduser from './user.quizs';
import userQuestionsReduser from './user.questions';
import adminQuizsReduser from './admin.quizs';
import adminQuestionsReduser from './admin.questions';
import adminResultsReduser from './admin.results';
import serverDateTimeZone from './server.date.time.zone';

import {rootSaga} from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const rootStore = configureStore({
	reducer: {
    registration: registrationReduser,
		auth: authReduser,
		userQuizs: userQuizsReduser,
		userQuestions: userQuestionsReduser,
		adminQuizs: adminQuizsReduser,
		adminQuestions: adminQuestionsReduser,
		adminResults: adminResultsReduser,
		serverDateTimeZone: serverDateTimeZone,
	},
	middleware: [...getDefaultMiddleware({thunk: false, serializableCheck: false}), sagaMiddleware]
});

sagaMiddleware.run(rootSaga);
