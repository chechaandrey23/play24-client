import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {Quizs} from '../components/Quizs';

export interface QuizsPageProps {}

export const QuizsPage: React.FC<QuizsPageProps> = () => {
  return (<>
    <Header />
    <Quizs />
    <Footer />
  </>);
}
