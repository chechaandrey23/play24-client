import {createSlice} from '@reduxjs/toolkit';

export interface UserQuizsInterface {
  quizs: Array<any>;
  loadQuizs: boolean;
  errorQuizs: any;

  createQuizAttempt: any;
  loadCreateQuizAttempt: boolean;
  errorCreateQuizAttempt: any;

  finishQuizAttempt: any;
  loadFinishQuizAttempt: boolean;
  errorFinishQuizAttempt: any;

  quiz: any;
  loadQuiz: boolean;
  errorQuiz: any;

  checkQuiz: any;
  loadCheckQuiz: boolean;
  errorCheckQuiz: any;

  finishQuiz: any;
  loadFinishQuiz: boolean;
  errorFinishQuiz: any;
}

export const storeQuizs = createSlice({
	name: 'userQuizs',
	initialState: {
    quizs: [],
    loadQuizs: false,
    errorQuizs: false,

    createQuizAttempt: null,
    loadCreateQuizAttempt: false,
    errorCreateQuizAttempt: false,

    finishQuizAttempt: null,
    loadFinishQuizAttempt: false,
    errorFinishQuizAttempt: false,

    quiz: null,
    loadQuiz: false,
    errorQuiz: false,

    checkQuiz: null,
    loadCheckQuiz: false,
    errorCheckQuiz: false,

    finishQuiz: null,
    loadFinishQuiz: false,
    errorFinishQuiz: false,
	} as UserQuizsInterface,
	reducers: {
    quizs(state, action) {
			state.quizs = [...action.payload];
		},
		startLoadQuizs(state, action) {
			state.loadQuizs = true;
		},
		endLoadQuizs(state, action) {
			state.loadQuizs = false;
		},
		errorQuizs(state, action) {
			state.errorQuizs = action.payload;
		},

    createQuizAttempt(state, action) {
      state.createQuizAttempt = action.payload;
    },
    startLoadCreateQuizAttempt(state, action) {
      state.loadCreateQuizAttempt = true;
		},
		endLoadCreateQuizAttempt(state, action) {
			state.loadCreateQuizAttempt = false;
		},
    errorCreateQuizAttempt(state, action) {
      state.errorCreateQuizAttempt = action.payload;
    },

    finishQuizAttempt(state, action) {
      state.finishQuizAttempt = action.payload;
    },
    startLoadFinishQuizAttempt(state, action) {
      state.loadFinishQuizAttempt = true;
    },
    endLoadFinishQuizAttempt(state, action) {
      state.loadFinishQuizAttempt = false;
    },
    errorFinishQuizAttempt(state, action) {
      state.errorFinishQuizAttempt = action.payload;
    },

    quiz(state, action) {
			state.quiz = action.payload;
		},
		startLoadQuiz(state, action) {
			state.loadQuiz = true;
		},
		endLoadQuiz(state, action) {
			state.loadQuiz = false;
		},
		errorQuiz(state, action) {
			state.errorQuiz = action.payload;
		},

    checkQuiz(state, action) {
			state.checkQuiz = {...action.payload};
		},
		startLoadCheckQuiz(state, action) {
			state.loadCheckQuiz = true;
		},
		endLoadCheckQuiz(state, action) {
			state.loadCheckQuiz = false;
		},
		errorCheckQuiz(state, action) {
			state.errorCheckQuiz = action.payload;
		},

		finishQuiz(state, action) {
			state.finishQuiz = {...action.payload};
		},
		startLoadFinishQuiz(state, action) {
			state.loadFinishQuiz = true;
		},
		endLoadFinishQuiz(state, action) {
			state.loadFinishQuiz = false;
		},
		errorFinishQuiz(state, action) {
			state.errorFinishQuiz = action.payload;
		},
	}
});

export const {quizs, startLoadQuizs, endLoadQuizs, errorQuizs,
              quiz, startLoadQuiz, endLoadQuiz, errorQuiz,
              createQuizAttempt, startLoadCreateQuizAttempt, endLoadCreateQuizAttempt, errorCreateQuizAttempt,
              finishQuizAttempt, startLoadFinishQuizAttempt, endLoadFinishQuizAttempt, errorFinishQuizAttempt,
              checkQuiz, startLoadCheckQuiz, endLoadCheckQuiz, errorCheckQuiz,
              finishQuiz, startLoadFinishQuiz, endLoadFinishQuiz, errorFinishQuiz} = storeQuizs.actions;

export default storeQuizs.reducer;
