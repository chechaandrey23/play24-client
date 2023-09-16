export interface DefaultRequestSettingsInterface {
  responseType: 'json';
	JWTRefreshUpdate: boolean;
	JWTRefreshUpdateMethod: 'POST'|'GET';
	JWTRefreshUpdateURL: string;
  withCredentials: boolean;
  baseURL: string;
  JWTRefreshUpdateFn: (a: any) => void;
}

export const defaultRequestSettings = {
	//timeout: 5000,
  responseType: 'json',
	JWTRefreshUpdate: true,
	JWTRefreshUpdateMethod: 'POST',
	JWTRefreshUpdateURL: '/auth/api/refresh',
  withCredentials: true,
  baseURL: 'http://localhost:6066/',
  //JWTRefreshUpdateFn: null,
} as DefaultRequestSettingsInterface;
