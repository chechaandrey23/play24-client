import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {UserQuestionItem} from '../components/UserQuestionItem';

export interface UserQuestionItemPageProps {}

export const UserQuestionItemPage: React.FC<UserQuestionItemPageProps> = () => {
  return (<>
    <Header />
    <UserQuestionItem />
    <Footer />
  </>);
}
