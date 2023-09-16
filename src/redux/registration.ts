import {createSlice} from '@reduxjs/toolkit';

export interface RegistrationInterface {
	registration: boolean;
	loadRegistration: boolean;
	errorRegistration: boolean;
	roles: Array<any>;
	loadRoles: boolean;
	errorRoles: boolean;
}

export const storeRegistration = createSlice({
	name: 'registration',
	initialState: {
    registration: false,
    loadRegistration: false,
    errorRegistration: false,
    //user: null,
		roles: [],
		loadRoles: false,
		errorRoles: false,
	} as RegistrationInterface,
	reducers: {
    registration(state, action) {
			state.registration = action.payload;
		},
		startLoadRegistration(state, action) {
			state.loadRegistration = true;
		},
		endLoadRegistration(state, action) {
			state.loadRegistration = false;
		},
		errorRegistration(state, action) {
			state.errorRegistration = action.payload;
		},
		//user(state, action) {
		//	state.user = {...action.payload};
		//},
		roles(state, action) {
			state.roles = [...action.payload];
		},
		startLoadRoles(state, action) {
			state.loadRoles = true;
		},
		endLoadRoles(state, action) {
			state.loadRoles = false;
		},
		errorRoles(state, action) {
			state.errorRoles = action.payload;
		},
	}
});

export const {registration, startLoadRegistration, endLoadRegistration, errorRegistration,
              roles, startLoadRoles, endLoadRoles, errorRoles} = storeRegistration.actions;

export default storeRegistration.reducer;
