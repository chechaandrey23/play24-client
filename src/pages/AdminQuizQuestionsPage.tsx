import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {AdminQuizQuestions} from '../components/AdminQuizQuestions';

export interface AdminQuizQuestionsPageProps {}

export const AdminQuizQuestionsPage: React.FC<AdminQuizQuestionsPageProps> = () => {
  return (<>
    <Header />
    <AdminQuizQuestions />
    <Footer />
  </>);
}
