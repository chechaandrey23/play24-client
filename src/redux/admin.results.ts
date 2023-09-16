import {createSlice} from '@reduxjs/toolkit';

export interface AdminResultsInterface {
  results: any;
  loadResults: boolean;
  errorResults: any;

  resetResult: Array<any>;
  loadResetResult: Array<string>;
  errorResetResult: any;
}

export const storeResults = createSlice({
	name: 'adminResults',
	initialState: {
    results: null,
    loadResults: false,
    errorResults: false,

    resetResult: [],
    loadResetResult: [],
    errorResetResult: false,
	} as AdminResultsInterface,
	reducers: {
    results(state, action) {
			state.results = action.payload;
		},
		startLoadResults(state, action) {
			state.loadResults = true;
		},
		endLoadResults(state, action) {
			state.loadResults = false;
		},
		errorResults(state, action) {
			state.errorResults = action.payload;
		},

    resetResult(state, action) {
      state.resetResult = action.payload;
      state.results = {...state.results, attempts: state.results.attempts.filter((entry: any) => {
        return action.payload._id !== entry._id;
      })};

    },
    startLoadResetResult(state, action) {
      state.loadResetResult = [...state.loadResetResult, action.payload];
    },
    endLoadResetResult(state, action) {
      state.loadResetResult = state.loadResetResult.filter((entry: any): boolean => entry != action.payload);
    },
    errorResetResult(state, action) {
			state.errorResetResult = action.payload;
		},
	}
});

export const {results, startLoadResults, endLoadResults, errorResults,
              resetResult, startLoadResetResult, endLoadResetResult, errorResetResult,} = storeResults.actions;

export default storeResults.reducer;
