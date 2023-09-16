import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {AdminQuizs} from '../components/AdminQuizs';

export interface AdminQuizsPageProps {}

export const AdminQuizsPage: React.FC<AdminQuizsPageProps> = () => {
  return (<>
    <Header />
    <AdminQuizs />
    <Footer />
  </>);
}
