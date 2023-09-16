import React, {useRef, useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Container, Box} from '@mui/material';
import dayjs from 'dayjs';

import {router as routerConfig} from './router';

import {useSelector, useDispatch} from 'react-redux';

import {sagaGetUser} from './redux/sagas/auth';
import {sagaServerDateTimeZone} from './redux/sagas/server.date.time.zone';

import {setDiffHours} from './redux/server.date.time.zone';

const router = createBrowserRouter(routerConfig);

export interface AppProps {}

export const App: React.FC<AppProps> = () => {
  const dispatch = useDispatch();

  const errorUser = useSelector((state: any) => state.auth.errorUser);

  const serverDateTimeZone = useSelector((state: any) => state.serverDateTimeZone.serverDateTimeZone);

  useEffect(() => {
    // ..........??????????????????????????????????????????????????????????
    //dispatch(sagaGetUser());
  }, []);

  /*
  useEffect(() => {
    dispatch(sagaServerDateZoneTime());
  }, []);

  useEffect(() => {
    const clientDateTimeZone = (new Date()).getTimezoneOffset()/60;

    dispatch(setDiffHours());
  }, [serverDateTimeZone])
  */

  return (<>
    <Container maxWidth={window.screen.width < 1920?'md':'lg'} sx={{
      pl: {xs: 1, sm: 1}, pr: {xs: 1, sm: 1},
      overflowX: 'hidden',
    }}>
      <RouterProvider router={router} />
    </Container>
  </>);
}
