import {createSlice} from '@reduxjs/toolkit';

export interface AdminQuestionsInterface {
  quiz: any,
  questions: Array<any>;
  loadQuestions: boolean;
  errorQuestions: any;

  fullQuestions: {[key: string]: any};
  loadFullQuestions: Array<string>;
  errorFullQuestions: any;

  createQuestion: any;
  loadCreateQuestion: boolean;
  errorCreateQuestion: any;

  deleteQuestion: any;
  loadDeleteQuestion: Array<string>;
  errorDeleteQuestion: any;

  loadOrderQuestion: boolean;
  errorOrderQuestion: any;

  questionTypes: Array<any>;
  loadQuestionTypes: boolean;
  errorQuestionTypes: any;

  loadEditQuestionDraft: Array<string>;
  errorEditQuestionDraft: any;
}

export const storeQuestions = createSlice({
	name: 'adminQuestions',
	initialState: {
    quiz: null,
    questions: [],
    loadQuestions: false,
    errorQuestions: false,

    fullQuestions: {},
    loadFullQuestions: [],
    errorFullQuestions: false,

    createQuestion: null,
    loadCreateQuestion: false,
    errorCreateQuestion: false,

    deleteQuestion: null,
    loadDeleteQuestion: [],
    errorDeleteQuestion: false,

    loadOrderQuestion: false,
    errorOrderQuestion: false,

    questionTypes: [],
		loadQuestionTypes: false,
		errorQuestionTypes: false,

    loadEditQuestionDraft: [],
    errorEditQuestionDraft: false,
	} as AdminQuestionsInterface,
	reducers: {
    quiz(state, action) {
      state.quiz = action.payload;
    },
    questions(state, action) {
			state.questions = [...action.payload];
		},
    questionsWithSortOrder(state, action) {
      state.questions = [...action.payload].sort((a: any, b: any) => {return a.order-b.order})
    },
    questionsWithOutSortOrder(state, action) {
      state.questions = [...action.payload];
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

    addFullQuestion(state, action) {
      state.fullQuestions = {...state.fullQuestions, [action.payload._id]: action.payload};
    },
    fullQuestions(state, action) {
      state.fullQuestions = action.payload;
		},
		startLoadFullQuestions(state, action) {
      state.fullQuestions[action.payload] = null;
			state.loadFullQuestions = [...state.loadFullQuestions, action.payload];
		},
		endLoadFullQuestions(state, action) {
			state.loadFullQuestions = state.loadFullQuestions.filter((entry: any): boolean => entry != action.payload);
		},
		errorFullQuestions(state, action) {
			state.errorFullQuestions = action.payload;
		},

		createQuestion(state, action) {
      state.createQuestion = action.payload;
    },
    addToQuestions(state, action) {
      state.questions = [...state.questions, action.payload];
    },
    startLoadCreateQuestion(state, action) {
			state.loadCreateQuestion = true;
		},
		endLoadCreateQuestion(state, action) {
			state.loadCreateQuestion = false;
		},
		errorCreateQuestion(state, action) {
			state.errorCreateQuestion = action.payload;
		},

    deleteQuestion(state, action) {
			state.deleteQuestion = action.payload;
      state.questions = state.questions.filter((entry: any): boolean => entry._id != action.payload._id);
		},
		startLoadDeleteQuestion(state, action) {
			state.loadDeleteQuestion = [...state.loadDeleteQuestion, action.payload];
		},
		endLoadDeleteQuestion(state, action) {
			state.loadDeleteQuestion = state.loadDeleteQuestion.filter((entry: any): boolean => entry != action.payload);
		},
		errorDeleteQuestion(state, action) {
			state.errorDeleteQuestion = action.payload;
		},

    orderQuestions(state, action) {
      state.questions = [...action.payload];
    },
    startLoadOrderQuestion(state, action) {
			state.loadOrderQuestion = true;
		},
		endLoadOrderQuestion(state, action) {
			state.loadOrderQuestion = false;
		},
		errorOrderQuestion(state, action) {
			state.errorOrderQuestion = action.payload;
		},

    questionTypes(state, action) {
      state.questionTypes = [...action.payload];
    },
    startLoadQuestionTypes(state, action) {
      state.loadQuestionTypes = true;
    },
    endLoadQuestionTypes(state, action) {
      state.loadQuestionTypes = false;
    },
    errorQuestionTypes(state, action) {
      state.loadQuestionTypes = action.payload;
    },

    editQuestionDraft(state, action) {
      state.questions = state.questions.map((entry) => {
        return entry._id==action.payload._id?{...action.payload}:entry;
      });
    },
    startLoadEditQuestionDraft(state, action) {
			state.loadEditQuestionDraft = [...state.loadEditQuestionDraft, action.payload];
		},
		endLoadEditQuestionDraft(state, action) {
			state.loadEditQuestionDraft = state.loadEditQuestionDraft.filter((entry: any): boolean => entry != action.payload);
		},
		errorEditQuestionDraft(state, action) {
			state.errorEditQuestionDraft = action.payload;
		},
	}
});

export const {questions, questionsWithSortOrder, questionsWithOutSortOrder, quiz, startLoadQuestions, endLoadQuestions, errorQuestions,
              fullQuestions, addFullQuestion, startLoadFullQuestions, endLoadFullQuestions, errorFullQuestions,
              createQuestion, addToQuestions, startLoadCreateQuestion, endLoadCreateQuestion, errorCreateQuestion,
              deleteQuestion, startLoadDeleteQuestion, endLoadDeleteQuestion, errorDeleteQuestion,
              orderQuestions, startLoadOrderQuestion, endLoadOrderQuestion, errorOrderQuestion,
              questionTypes, startLoadQuestionTypes, endLoadQuestionTypes, errorQuestionTypes,
              editQuestionDraft, startLoadEditQuestionDraft, endLoadEditQuestionDraft, errorEditQuestionDraft} = storeQuestions.actions;

export default storeQuestions.reducer;
