import React, {useEffect} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack, CircularProgress} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {LoadingButton} from '@mui/lab';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import {sagaUserGetQuiz, sagaUserQuizCreateAttempt} from '../redux/sagas/user.quizs';
import {errorCreateQuizAttempt as errorCreateQuizAttemptAC, createQuizAttempt as createQuizAttemptAC} from '../redux/user.quizs';

import {CenterContent} from './CenterContent';

export interface UserQuizStartProps {}

export const UserQuizStart: React.FC<UserQuizStartProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();

  const errorQuiz = useSelector((state: any) => state.userQuizs.errorQuiz);
	const quiz = useSelector((state: any) => state.userQuizs.quiz);
  const loadQuiz = useSelector((state: any) => state.userQuizs.loadQuiz);

  const errorCreateQuizAttempt = useSelector((state: any) => state.userQuizs.errorCreateQuizAttempt);
	const createQuizAttempt = useSelector((state: any) => state.userQuizs.createQuizAttempt);
  const loadCreateQuizAttempt = useSelector((state: any) => state.userQuizs.loadCreateQuizAttempt);

  useEffect(() => {
    dispatch(sagaUserGetQuiz({quizId: routeParams.quizId}));
  }, [routeParams]);

  useEffect(() => {
    if(createQuizAttempt) {
      dispatch(createQuizAttemptAC(null));
      if(quiz.questions.length > 0) {
        navigate(`/user/quiz-questions/${quiz._id}/${quiz.questions[0]}/${createQuizAttempt._id}`);
      } else {
        navigate(`/user/quiz/${quiz._id}/finish/${createQuizAttempt._id}`);
      }
    }
  }, [createQuizAttempt]);

  const oDateTime = dayjs(quiz?.duration).utc();

  return (<CenterContent>
    <Grid container sx={{maxWidth: 'sm'}}>
      {loadQuiz?<Grid item xs={12}>{'Loading'}</Grid>:null}
      {(quiz && !loadQuiz)?<Grid item xs={12} sx={{gap: 1, display: 'flex', flexDirection: 'column'}}>
        <Paper sx={{p: 1}}>
          <Grid container sx={{rowGap: 1}}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">{quiz.quizname}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">{quiz.description}</Typography>
            </Grid>
            <Grid item xs={5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`ID: `}</Typography>
              <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{quiz._id}</Typography>
            </Grid>
            <Grid item xs={3} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`Questions: `}</Typography>
              <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{quiz.questions.length}</Typography>
            </Grid>
            <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{'Duration: '}</Typography>
              <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, display: 'flex', fontWeight: 'bold'}}>
                {quiz.duration===0?<AllInclusiveIcon />:(oDateTime.hour().toString().padStart(2, '0')+':'+oDateTime.minute().toString().padStart(2, '0')+':'+oDateTime.second().toString().padStart(2, '0'))}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{width: '100%', minHeight: '10vh'}}>
          {!loadCreateQuizAttempt?<Button variant="contained" color="success" size="large"
                                     sx={{width: 'inherit', minHeight: 'inherit'}}
                                     endIcon={<PlayCircleOutlineIcon color="inherit" sx={{width: '8vw', height: '8vh'}} />}
                                     onClick={() => {
                                       dispatch(errorCreateQuizAttemptAC(false));
                                       dispatch(sagaUserQuizCreateAttempt({quizId: quiz._id}));
                                     }}>
            <Typography variant="h2" sx={{}}>
              {'Start Quiz'}
            </Typography>
          </Button>:<LoadingButton loading={true}
                                   loadingIndicator={<CircularProgress color="inherit" size={64} />}
                                   sx={{width: 'inherit', minHeight: 'inherit'}}
                                   loadingPosition="end"
                                   variant="outlined">
            <Typography variant="h2" sx={{}}>
              {'Starting...'}
            </Typography>
          </LoadingButton>}
        </Box>
      </Grid>:null}
    </Grid>
  </CenterContent>);
}
