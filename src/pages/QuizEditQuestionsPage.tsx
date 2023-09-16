import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {QuizEditQuestions} from '../components/QuizEditQuestions';

export interface QuizEditQuestionsPageProps {}

export const QuizEditQuestionsPage: React.FC<QuizEditQuestionsPageProps> = () => {
  return (<>
    <Header />
    <QuizEditQuestions />
    <Footer />
  </>);
}
