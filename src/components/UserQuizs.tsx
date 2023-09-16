import React, {useEffect} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

import {CenterContent} from './CenterContent';

import {UserQuizItem} from './UserQuizItem';

import {sagaUserQuizs} from '../redux/sagas/user.quizs';

export interface UserQuizsProps {}

export const UserQuizs: React.FC<UserQuizsProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorQuizs = useSelector((state: any) => state.userQuizs.errorQuizs);
	const quizs = useSelector((state: any) => state.userQuizs.quizs);
  const loadQuizs = useSelector((state: any) => state.userQuizs.loadQuizs);

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
		if(!user) {
			//navigate('/login');
		}
	}, [user]);

  useEffect(() => {
    dispatch(sagaUserQuizs());
  }, []);

  return (<CenterContent>
    <Grid container sx={{alignSelf: 'start', pt: 1, pb: 1}}>
      <Grid item sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant="h4">Quizs</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container sx={{pt: 1, pb: 1}}>
          {loadQuizs?<Box>{'Loading...'}</Box>:(
            (quizs.length < 1)?<Box>{'Empty!!!'}</Box>:quizs.map((entry: any) => {
              return (<Grid item xs={12} key={entry._id}>
                <UserQuizItem id={entry._id}
                              attempts={entry.attempts}
                              duration={entry.duration}
                              numberOfAttempts={entry.numberOfAttempts}
                              questions={entry.questions || []}
                              quizname={entry.quizname}/>
              </Grid>);
            })
          )}
        </Grid>
      </Grid>
    </Grid>
  </CenterContent>);
}
