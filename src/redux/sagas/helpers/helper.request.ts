import axios from 'axios';
import {defaultRequestSettings, DefaultRequestSettingsInterface} from './helper.default.request.settings';

export function request<T>(opts: any): Promise<T> {
	opts = opts || {};
	return new Promise<T>((res, rej) => {
		axios(opts).then((response) => {
			res(response as T);
		}).catch((e) => {
			if(e.response && e.response.status === 401 && opts.JWTRefreshUpdate) {
				// once-refresh request!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				axios({
					...defaultRequestSettings,
					method: opts.JWTRefreshUpdateMethod || 'GET',
					url: opts.JWTRefreshUpdateURL
				}).then((response) => {
					if(typeof opts.JWTRefreshUpdateFn === 'function') {
						opts.JWTRefreshUpdateFn.call(null, response);
					}
					axios(opts).then((response) => {
						res(response as T);
					}).catch((e) => {
						rej(getError(e))
					});
				}).catch((e) => {
					rej(getError(e));
				});
			} else {
				rej(getError(e))
			}
		});
	});
}

function getError(e: Error) {
	if((e as any).response) {
		if(!(e as any).response.data) (e as any).response.data = e;
		return (e as any).response;
	} else if((e as any).request) {
		if(!(e as any).request.data) (e as any).request.data = e;
		return (e as any).request;
	} else {
		if(!(e as any).data) (e as any).data = e;
		return e;
	}
}
