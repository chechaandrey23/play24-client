import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {Registration} from '../components/Registration';

export interface RegistrationPageProps {}

export const RegistrationPage: React.FC<RegistrationPageProps> = () => {
  return (<>
    <Header />
    <Registration />
    <Footer />
  </>);
}
