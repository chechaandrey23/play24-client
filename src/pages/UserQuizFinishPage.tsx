import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuizFinish} from '../components/UserQuizFinish';

export interface UserQuizFinishPageProps {}

export const UserQuizFinishPage: React.FC<UserQuizFinishPageProps> = () => {
  return (<>
    <Header />
    <UserQuizFinish />
    <Footer />
  </>);
}
