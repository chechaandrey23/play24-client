import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {QuizItem} from '../components/QuizItem';

export interface QuizItemPageProps {}

export const QuizItemPage: React.FC<QuizItemPageProps> = () => {
  return (<>
    <Header />
    <QuizItem />
    <Footer />
  </>);
}
