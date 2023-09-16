import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {QuizQuestionItem} from '../components/QuizQuestionItem';

export interface QuizQuestionItemPageProps {}

export const QuizQuestionItemPage: React.FC<QuizQuestionItemPageProps> = () => {
  return (<>
    <Header />
    <QuizQuestionItem />
    <Footer />
  </>);
}
