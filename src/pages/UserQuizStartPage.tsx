import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuizStart} from '../components/UserQuizStart';

export interface UserQuizStartPageProps {}

export const UserQuizStartPage: React.FC<UserQuizStartPageProps> = () => {
  return (<>
    <Header />
    <UserQuizStart />
    <Footer />
  </>);
}
