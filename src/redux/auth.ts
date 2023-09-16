import {createSlice} from '@reduxjs/toolkit';

export const storeAuth = createSlice({
	name: 'auth',
	initialState: {
    login: false,
		loadLogin: false,
		errorLogin: false,

    logout: false,
		loadLogout: false,
		errorLogout: false,

    user: null,
		loadUser: false,
		errorUser: false,
	},
	reducers: {
    login(state, action) {
			state.login = action.payload;
		},
		startLoadLogin(state, action) {
			state.loadLogin = true;
		},
		endLoadLogin(state, action) {
			state.loadLogin = false;
		},
		errorLogin(state, action) {
			state.errorLogin = action.payload;
		},

    logout(state, action) {
			state.logout = action.payload;
		},
		startLoadLogout(state, action) {
			state.loadLogout = true;
		},
		endLoadLogout(state, action) {
			state.loadLogout = false;
		},
		errorLogout(state, action) {
			state.errorLogout = action.payload;
		},

		user(state, action) {
			state.user = {...action.payload};
		},
		startLoadUser(state, action) {
			state.loadUser = true;
		},
		endLoadUser(state, action) {
			state.loadUser = false;
		},
		errorUser(state, action) {
			state.errorUser = action.payload;
		},
	}
});

export const {login, startLoadLogin, endLoadLogin, errorLogin,
              logout, startLoadLogout, endLoadLogout, errorLogout,
              user, startLoadUser, endLoadUser, errorUser} = storeAuth.actions;

export default storeAuth.reducer;
