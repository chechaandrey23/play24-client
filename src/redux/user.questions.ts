import {createSlice} from '@reduxjs/toolkit';

export interface UserQuestionsInterface {
  questions: Array<any>;
  loadQuestions: boolean;
  errorQuestions: any;

  currentQuestion: any;
  loadCurrentQuestion: boolean;
  errorCurrentQuestion: any;

  editCurrentQuestion: any;
  loadEditCurrentQuestion: boolean;
  errorEditCurrentQuestion: any;

  fullQuiz: any;
  fullQuizQuestions: Array<any>;
  fullQuizQuestion: any;
  loadFullQuiz: boolean;
  errorFullQuiz: any;
}

export const storeQuestions = createSlice({
	name: 'userQuestions',
	initialState: {
    questions: [],
    loadQuestions: false,
    errorQuestions: false,

    currentQuestion: null,
    loadCurrentQuestion: false,
    errorCurrentQuestion: false,

    editCurrentQuestion: null,
    loadEditCurrentQuestion: false,
    errorEditCurrentQuestion: false,

    fullQuiz: null,
    fullQuizQuestions: [],
    fullQuizQuestion: null,
    loadFullQuiz: false,
    errorFullQuiz: false,
	} as UserQuestionsInterface,
	reducers: {
    questions(state, action) {
			state.questions = [...action.payload];
		},
    questionsWithSortOrder(state, action) {
      state.questions = [...action.payload].sort((a: any, b: any) => {return a.order-b.order})
    },
    questionsWithOutSortOrder(state, action) {
      state.questions = [...action.payload];
    },
    replaceQuestion(state, action) {
      state.questions = [...state.questions].map((entry) => entry._id===action.payload._id?action.payload:entry);
    },
		startLoadQuestions(state, action) {
			state.loadQuestions = true;
		},
		endLoadQuestions(state, action) {
			state.loadQuestions = false;
		},
		errorQuestions(state, action) {
			state.errorQuestions = action.payload;
		},

    currentQuestion(state, action) {
			state.currentQuestion = action.payload;
		},
		startLoadCurrentQuestion(state, action) {
			state.loadCurrentQuestion = true;
		},
		endLoadCurrentQuestion(state, action) {
			state.loadCurrentQuestion = false;
		},
		errorCurrentQuestion(state, action) {
			state.errorCurrentQuestion = action.payload;
		},

    editCurrentQuestion(state, action) {
      state.editCurrentQuestion = action.payload;
    },
		startLoadEditCurrentQuestion(state, action) {
			state.loadEditCurrentQuestion = true;
		},
		endLoadEditCurrentQuestion(state, action) {
			state.loadEditCurrentQuestion = false;
		},
		errorEditCurrentQuestion(state, action) {
			state.errorEditCurrentQuestion = action.payload;
		},

    fullQuiz(state, action) {
      state.fullQuiz = action.payload;
    },
    fullQuizQuestions(state, action) {
      state.fullQuizQuestions = [...action.payload];
    },
    fullQuizQuestionsWithSortOrder(state, action) {
      state.fullQuizQuestions = [...action.payload].sort((a: any, b: any) => {return a.order-b.order})
    },
    fullQuizQuestionsWithOutSortOrder(state, action) {
      state.fullQuizQuestions = [...action.payload];
    },
    replaceFullQuizQuestion(state, action) {
      state.fullQuizQuestions = [...state.fullQuizQuestions].map((entry) => entry._id===action.payload._id?action.payload:entry);
    },
    fullQuizQuestion(state, action) {
      state.fullQuizQuestion = action.payload;
    },
    startLoadFullQuiz(state, action) {
			state.loadFullQuiz = true;
		},
    endLoadFullQuiz(state, action) {
			state.loadFullQuiz = false;
		},
    errorFullQuiz(state, action) {
      state.errorFullQuiz = action.payload;
    },
	}
});

export const {questions, replaceQuestion, questionsWithSortOrder, questionsWithOutSortOrder, startLoadQuestions, endLoadQuestions, errorQuestions,
              currentQuestion, startLoadCurrentQuestion, endLoadCurrentQuestion, errorCurrentQuestion,
              editCurrentQuestion, startLoadEditCurrentQuestion, endLoadEditCurrentQuestion, errorEditCurrentQuestion,
              fullQuiz, fullQuizQuestions, fullQuizQuestionsWithSortOrder, fullQuizQuestionsWithOutSortOrder, fullQuizQuestion,
              replaceFullQuizQuestion, startLoadFullQuiz, endLoadFullQuiz, errorFullQuiz} = storeQuestions.actions;

export default storeQuestions.reducer;
