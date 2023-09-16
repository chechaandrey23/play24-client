import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {ErrorContent} from '../components/ErrorContent';

export interface ErrorPageProps {}

export const ErrorPage: React.FC<ErrorPageProps> = () => {
  return (<>
    <Header />
    <ErrorContent />
    <Footer />
  </>);
}
