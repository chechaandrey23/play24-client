import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {Login} from '../components/Login';

export interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
  return (<>
    <Header />
    <Login />
    <Footer />
  </>);
}
