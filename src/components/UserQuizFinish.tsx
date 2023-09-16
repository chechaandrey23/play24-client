import React, {useEffect, useState} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack, CircularProgress} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {LoadingButton} from '@mui/lab';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import DoneAllIcon from '@mui/icons-material/DoneAll';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import TimerIcon from '@mui/icons-material/Timer';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReplyIcon from '@mui/icons-material/Reply';

import {CenterContent} from './CenterContent';
import {MyTimer} from './MyTimer';
import {AlertError} from './AlertError';

import {sagaUserGetQuiz, sagaUserQuizFinishAttempt} from '../redux/sagas/user.quizs';
import {sagaUserQuestions, sagaUserFullQuiz} from '../redux/sagas/user.questions';
import {errorFinishQuizAttempt as errorFinishQuizAttemptAC, finishQuizAttempt as finishQuizAttemptAC} from '../redux/user.quizs';

export interface UserQuizFinishProps {}

export const UserQuizFinish: React.FC<UserQuizFinishProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();

  //const errorQuiz = useSelector((state: any) => state.userQuizs.errorQuiz);
	//const quiz = useSelector((state: any) => state.userQuizs.quiz);
  //const loadQuiz = useSelector((state: any) => state.userQuizs.loadQuiz);

  const errorFinishQuizAttempt = useSelector((state: any) => state.userQuizs.errorFinishQuizAttempt);
	const finishQuizAttempt = useSelector((state: any) => state.userQuizs.finishQuizAttempt);
  const loadFinishQuizAttempt = useSelector((state: any) => state.userQuizs.loadFinishQuizAttempt);

  //const errorQuestions = useSelector((state: any) => state.userQuestions.errorQuestions);
	//const questions = useSelector((state: any) => state.userQuestions.questions);
  //const loadQuestions = useSelector((state: any) => state.userQuestions.loadQuestions);

  const fullQuiz = useSelector((state: any) => state.userQuestions.fullQuiz);
  const fullQuizQuestions = useSelector((state: any) => state.userQuestions.fullQuizQuestions);
  //const fullQuizQuestion = useSelector((state: any) => state.userQuestions.fullQuizQuestion);
  const loadFullQuiz = useSelector((state: any) => state.userQuestions.loadFullQuiz);
  const errorFullQuiz = useSelector((state: any) => state.userQuestions.errorFullQuiz);

  useEffect(() => {
    dispatch(sagaUserFullQuiz({
      quizId: routeParams.quizId,
      questionId: routeParams.questionId,
      attemptId: routeParams.attemptId,
    }));
  }, [routeParams]);

  /*
  useEffect(() => {
    dispatch(sagaUserGetQuiz({
      quizId: routeParams.quizId,
      attemptId: routeParams.attemptId
    }));
  }, [routeParams]);

  useEffect(() => {
    dispatch(sagaUserQuestions({
      quizId: routeParams.quizId,
      attemptId: routeParams.attemptId,
    }));
  }, [routeParams]);
  */
  useEffect(() => {
    dispatch(errorFinishQuizAttemptAC(false));
    if(finishQuizAttempt) {
      dispatch(finishQuizAttemptAC(null));
      navigate(`/user/quizs`);// or results!
    }
  }, [finishQuizAttempt]);

  const [quizTimeout, setQuizTimeout] = useState<boolean>(false);

  return (<CenterContent>
    <Grid container sx={{maxWidth: 'sm', alignSelf: 'start', rowGap: 1, pt: 1, pb: 1}}>
      {errorFinishQuizAttempt?<Grid item xs={12} sx={{pb: 1}}>
        <AlertError onCloseAlert={() => dispatch(errorFinishQuizAttemptAC(false))}
                    error={errorFinishQuizAttempt.error}
                    statusCode={errorFinishQuizAttempt.statusCode}
                    message={errorFinishQuizAttempt.message || errorFinishQuizAttempt.reason}
                    defaultAlerttitleMessage={'Server Error Finish Quiz'}/>
      </Grid>:null}
      {loadFullQuiz || !fullQuiz?<Grid item xs={12}>{'Quiz Loading...'}</Grid>:<><Grid item xs={12}>
        <Paper sx={{}}>
          <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1, columnGap: 2}}>
            <Grid item xs={12} sx={{pt: 0, pl: 1}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}}>{fullQuiz.quizname}</Typography>
            </Grid>
            <Grid item xs={12} sx={{pt: 0, pl: 2}}>
              <Typography variant="subtitle1" sx={{}}>{fullQuiz.description}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" sx={{fontSize: '2.5em'}}>{'Time left:'}</Typography>
            </Grid>
            <Grid item>
              {fullQuiz.duration === 0?<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                <AllInclusiveIcon sx={{color: "secondary.main", alignSelf: 'center', width: '3em', height: '3em'}} />
                <Typography variant="h6" sx={{color: 'secondary.main', fontWeight: 'bold', fontSize: '3em', ml: 1}}>{'Infinity'}</Typography>
              </Box>:(
                (quizTimeout || dayjs(fullQuiz.attempts[0].dateStart).valueOf()+fullQuiz.duration < Date.now())
                ?<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                  <TimerOffIcon sx={{color: "error.main", alignSelf: 'center', width: '3em', height: '3em'}} />
                  <Typography variant="h6" sx={{color: 'error.main', fontWeight: 'bold', ml: 1, fontSize: '3em'}}>{'time over!'}</Typography>
                </Box>
                :<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                  <TimerIcon sx={{width: '3em', height: '3em', color: "warning.main", alignSelf: 'center', mr: 1}} />
                  <MyTimer fontSize={'3em'}
                           onTimeout={() => {setQuizTimeout(true)}}
                           dateEnd={dayjs(fullQuiz.attempts[0].dateStart).valueOf()+fullQuiz.duration} />
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
      {!loadFinishQuizAttempt?<Button variant="contained" color="success" size="large"
                                 sx={{width: '100%', minHeight: 'inherit'}}
                                 disabled={loadFullQuiz || (fullQuiz.duration !== 0 && dayjs(fullQuiz.attempts[0].dateStart).valueOf()+fullQuiz.duration < Date.now())}
                                 endIcon={<DoneAllIcon color="inherit" sx={{width: '8vw', height: '8vh'}} />}
                                 onClick={() => {
                                   dispatch(errorFinishQuizAttemptAC(false));
                                   dispatch(sagaUserQuizFinishAttempt({quizId: fullQuiz._id, attemptId: fullQuiz.attempts[0]._id}));
                                 }}>
        <Typography variant="h2" sx={{}}>
          {'Finish Quiz'}
        </Typography>
      </Button>:<LoadingButton loading={true}
                               loadingIndicator={<CircularProgress color="inherit" size={64} />}
                               sx={{width: '100%', minHeight: 'inherit'}}
                               loadingPosition="end"
                               variant="outlined">
        <Typography variant="h2" sx={{}}>
          {'Ending...'}
        </Typography>
      </LoadingButton>}
      </Grid></>}
      {loadFullQuiz?<Grid item xs={12}>{'Questions Loading...'}</Grid>:(
        fullQuizQuestions.length===0?<Grid item xs={12}>{'Questions Not Found!!!'}</Grid>:<Grid item xs={12} sx={{mt: 0.5}}>
          <Grid container sx={{rowGap: 1, flexDirection: 'column'}}>{fullQuizQuestions.map((entry: any) => (<Grid item key={entry._id}>
            <Paper sx={{
                      '&:hover, &:hover .ID, &:hover .Answer *': {textDecoration: 'none', color: 'warning.main'},
                      '&:hover .Icon': {display: 'none'},
                      '&:hover .Back': {display: 'block'},
                      p: 1, display: 'flex'
                    }}
                    component={NavLink}
                    to={`/user/quiz-questions/${routeParams.quizId}/${entry._id}/${routeParams.attemptId}`}>
              <Box sx={{display: 'flex', alignItems: 'center', pr: 1, pl: 0}}>
                <Box className="Icon">
                  {entry.results.length > 0
                    ?<CheckBoxIcon sx={{color: 'primary.main', width: '2em', height: '2em'}} />
                    :<CheckBoxOutlineBlankIcon sx={{color: 'error.main', width: '2em', height: '2em'}} />}
                </Box>
                <Box className='Back' sx={{display: 'none'}}>
                  <ReplyIcon sx={{width: '2em', height: '2em'}} />
                </Box>
              </Box>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{}}>{entry.question}</Typography>
                </Grid>
                <Grid item xs={6} className="ID" sx={{display: 'flex', alignItems: 'center', color: 'text.secondary'}}>
                  <Typography variant={'body2'} sx={{}}>{`ID: `}</Typography>
                  <Typography variant={'body2'} sx={{ml: 1, fontWeight: 'bold'}}>{entry._id}</Typography>
                </Grid>
                <Grid item xs={6} className="Answer" sx={{display: 'flex', alignItems: 'center', color: 'text.secondary'}}>
                  <Typography variant={'body2'} sx={{}}>{`Answer: `}</Typography>
                  {entry.results.length > 0?<>
                    <Typography variant={'body2'} sx={{color: 'primary.main', ml: 1, fontWeight: 'bold'}}>
                      {Array.isArray(entry.results[0].userAnswer)?(entry.results[0].userAnswer).join(', '):entry.results[0].userAnswer}
                    </Typography>
                  </>:<>
                    <Typography variant={'body2'} sx={{color: 'error.main', ml: 1, fontWeight: 'bold'}}>{'NOT ANSWER'}</Typography>
                  </>}
                </Grid>
              </Grid>
            </Paper>
          </Grid>))}</Grid>
        </Grid>
      )}
    </Grid>
  </CenterContent>);
}
