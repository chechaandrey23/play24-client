import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuizQuestions} from '../components/UserQuizQuestions';

export interface UserQuizQuestionsPageProps {}

export const UserQuizQuestionsPage: React.FC<UserQuizQuestionsPageProps> = () => {
  return (<>
    <Header />
    <UserQuizQuestions />
    <Footer />
  </>);
}
