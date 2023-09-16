import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {AdminQuizResults} from '../components/AdminQuizResults';

export interface AdminQuizResultsPageProps {}

export const AdminQuizResultsPage: React.FC<AdminQuizResultsPageProps> = () => {
  return (<>
    <Header />
    <AdminQuizResults />
    <Footer />
  </>);
}
