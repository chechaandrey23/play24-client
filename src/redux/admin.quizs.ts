import {createSlice} from '@reduxjs/toolkit';

export interface AdminQuizsInterface {
  quizs: Array<any>;
  loadQuizs: boolean;
  errorQuizs: any;

  createQuiz: any;
  loadCreateQuiz: boolean;
  errorCreateQuiz: any;

  deleteQuiz: any;
  loadDeleteQuiz: Array<string>;
  errorDeleteQuiz: any;

  loadEditQuizDraft: Array<string>;
  errorEditQuizDraft: any;

  fullQuizs: {[key: string]: any};
  loadFullQuizs: Array<string>;
  errorFullQuizs: any;
}

export const storeQuizs = createSlice({
	name: 'adminQuizs',
	initialState: {
    quizs: [],
    loadQuizs: false,
    errorQuizs: false,

    createQuiz: null,
    loadCreateQuiz: false,
    errorCreateQuiz: false,

    deleteQuiz: null,
    loadDeleteQuiz: [],
    errorDeleteQuiz: false,

    loadEditQuizDraft: [],
    errorEditQuizDraft: false,

    fullQuizs: {},
    loadFullQuizs: [],
    errorFullQuizs: false,
	} as AdminQuizsInterface,
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

    createQuiz(state, action) {
      state.createQuiz = action.payload;
		},
    addToQuizs(state, action) {
      state.quizs = [...state.quizs, action.payload];
    },
		startLoadCreateQuiz(state, action) {
			state.loadCreateQuiz = true;
		},
		endLoadCreateQuiz(state, action) {
			state.loadCreateQuiz = false;
		},
		errorCreateQuiz(state, action) {
			state.errorCreateQuiz = action.payload;
		},

		deleteQuiz(state, action) {
			state.deleteQuiz = action.payload;
      state.quizs = state.quizs.filter((entry: any): boolean => entry._id != action.payload._id);
		},
		startLoadDeleteQuiz(state, action) {
			state.loadDeleteQuiz = [...state.loadDeleteQuiz, action.payload];
		},
		endLoadDeleteQuiz(state, action) {
			state.loadDeleteQuiz = state.loadDeleteQuiz.filter((entry: any): boolean => entry != action.payload);
		},
		errorDeleteQuiz(state, action) {
			state.errorDeleteQuiz = action.payload;
		},

    editQuizDraft(state, action) {
      state.quizs = state.quizs.map((entry) => {
        return entry._id==action.payload._id?{...action.payload}:entry;
      });
    },
    startLoadEditQuizDraft(state, action) {
			state.loadEditQuizDraft = [...state.loadEditQuizDraft, action.payload];
		},
		endLoadEditQuizDraft(state, action) {
			state.loadEditQuizDraft = state.loadEditQuizDraft.filter((entry: any): boolean => entry != action.payload);
		},
		errorEditQuizDraft(state, action) {
			state.errorEditQuizDraft = action.payload;
		},

    addFullQuiz(state, action) {
      state.fullQuizs = {...state.fullQuizs, [action.payload._id]: action.payload};
    },
    fullQuizs(state, action) {
      state.fullQuizs = action.payload;
		},
		startLoadFullQuizs(state, action) {
      state.fullQuizs[action.payload] = null;
			state.loadFullQuizs = [...state.loadFullQuizs, action.payload];
		},
		endLoadFullQuizs(state, action) {
			state.loadFullQuizs = state.loadFullQuizs.filter((entry: any): boolean => entry != action.payload);
		},
		errorFullQuizs(state, action) {
			state.errorFullQuizs = action.payload;
		},
	}
});

export const {quizs, startLoadQuizs, endLoadQuizs, errorQuizs,
              addFullQuiz, fullQuizs, startLoadFullQuizs, endLoadFullQuizs, errorFullQuizs,
              createQuiz, addToQuizs, startLoadCreateQuiz, endLoadCreateQuiz, errorCreateQuiz,
              deleteQuiz, startLoadDeleteQuiz, endLoadDeleteQuiz, errorDeleteQuiz,
              editQuizDraft, startLoadEditQuizDraft, endLoadEditQuizDraft, errorEditQuizDraft} = storeQuizs.actions;

export default storeQuizs.reducer;
