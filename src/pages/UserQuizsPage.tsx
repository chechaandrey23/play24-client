import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuizs} from '../components/UserQuizs';

export interface UserQuizsPageProps {}

export const UserQuizsPage: React.FC<UserQuizsPageProps> = () => {
  return (<>
    <Header />
    <UserQuizs />
    <Footer />
  </>);
}
