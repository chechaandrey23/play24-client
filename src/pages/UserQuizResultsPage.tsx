import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuizResults} from '../components/UserQuizResults';

export interface UserQuizResultsPageProps {}

export const UserQuizResultsPage: React.FC<UserQuizResultsPageProps> = () => {
  return (<>
    <Header />
    <UserQuizResults />
    <Footer />
  </>);
}
