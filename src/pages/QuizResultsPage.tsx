import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {QuizResults} from '../components/QuizResults';

export interface QuizResultsPageProps {}

export const QuizResultsPage: React.FC<QuizResultsPageProps> = () => {
  return (<>
    <Header />
    <QuizResults />
    <Footer />
  </>);
}
