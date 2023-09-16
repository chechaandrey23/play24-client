import * as React from 'react';

import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {Home} from '../components/Home';

export interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  return (<>
    <Header />
    <Home />
    <Footer />
  </>);
}
