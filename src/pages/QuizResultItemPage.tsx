import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {QuizResultItem} from '../components/QuizResultItem';

export interface QuizResultItemPageProps {}

export const QuizResultItemPage: React.FC<QuizResultItemPageProps> = () => {
  return (<>
    <Header />
    <QuizResultItem />
    <Footer />
  </>);
}
