import {createSlice} from '@reduxjs/toolkit';

export const storeServerDateTimeZone = createSlice({
	name: 'serverDateTimeZone',
	initialState: {
		serverDateTimeZone: null,
		loadServerDateTimeZone: false,
		errorServerDateTimeZone: false,
		diffHours: 0,
	},
	reducers: {
    serverDateTimeZone(state, action) {
			state.serverDateTimeZone = action.payload;
		},
		startLoadServerDateTimeZone(state, action) {
			state.loadServerDateTimeZone = true;
		},
		endLoadServerDateTimeZone(state, action) {
			state.loadServerDateTimeZone = false;
		},
		errorServerDateTimeZone(state, action) {
			state.errorServerDateTimeZone = action.payload;
		},

    setDiffHours(state, action) {
      state.diffHours = action.payload;
    },
	}
});

export const {serverDateTimeZone, startLoadServerDateTimeZone, endLoadServerDateTimeZone, errorServerDateTimeZone,
              setDiffHours} = storeServerDateTimeZone.actions;

export default storeServerDateTimeZone.reducer;
