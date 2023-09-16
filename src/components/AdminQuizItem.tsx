import * as React from 'react';
import {useRef, useEffect, useCallback, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {Container, Grid, Box, Paper, Typography, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip, CircularProgress, Chip} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import UpdateIcon from '@mui/icons-material/Update';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import TableRowsIcon from '@mui/icons-material/TableRows';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import {sagaAdminDeleteQuiz} from '../redux/sagas/admin.quizs';
import {sagaAdminEditQuizDraft, sagaAdminGetQuiz} from '../redux/sagas/admin.quizs';

import {AdminDeleteConfirm} from './AdminDeleteConfirm';

export interface AdminQuizItemProps {
  id: string;
  quizname: string;
  draft: boolean;
  duration: number;
  numberOfAttempts: number;
  questions: Array<string>;
}

export const AdminQuizItem: React.FC<AdminQuizItemProps> = (props) => {
  const dispatch = useDispatch();

  const [visibleButton, setVisibleButton] = useState<boolean>(false);
  const [confirmQuizDelete, setConfirmQuizDelete] = useState<boolean>(false);

  const [visibleButton0, setVisibleButton0] = useState<boolean>(false);
  const [fullQuiz, setFullQuiz] = useState<boolean>(false);

  const errorEditQuizDraft = useSelector((state: any) => state.adminQuizs.errorEditQuizDraft);
  const loadEditQuizDraft = useSelector((state: any) => state.adminQuizs.loadEditQuizDraft);

  const errorDeleteQuiz = useSelector((state: any) => state.adminQuizs.errorDeleteQuiz);
	//const deleteQuiz = useSelector((state: any) => state.adminQuizs.deleteQuiz);
  const loadDeleteQuiz = useSelector((state: any) => state.adminQuizs.loadDeleteQuiz);

  const fullQuizs = useSelector((state: any) => state.adminQuizs.fullQuizs);
  const loadFullQuizs = useSelector((state: any) => state.adminQuizs.loadFullQuizs);
  const errorFullQuizs = useSelector((state: any) => state.adminQuizs.errorFullQuizs);

  const loadingEditQuizDraft = useMemo(() => loadEditQuizDraft.includes(props.id), [loadEditQuizDraft, props]);
  const loadingDeleteQuiz = useMemo(() => loadDeleteQuiz.includes(props.id), [loadDeleteQuiz, props]);
  const loadingFullQuiz = useMemo(() => loadFullQuizs.includes(props.id), [loadFullQuizs, props]);

  const oDateTime = dayjs(props.duration).utc();

  const quiz = fullQuizs[props.id];

  return (<Paper sx={{mt: 0.5, mb: 0.5, pt: 0.5, pb: 0.5}}>
    <Grid container>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, ml: 1, minWidth: '2em'}}>
        {(loadingEditQuizDraft || loadingDeleteQuiz)?<Box>
          <CircularProgress color="warning" size='2em' />
        </Box>:null}
      </Grid>
      <Grid item sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
        <Grid container sx={{display: 'flex', alignItems: 'center'}}>
          <Grid item xs={12}><Typography variant={'body1'}>{props.quizname}</Typography></Grid>
          <Grid item xs={5} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`ID: `}</Typography>
            <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{props.id}</Typography>
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`Questions: `}</Typography>
            <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{props.questions.length}</Typography>
          </Grid>
          <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{'Duration: '}</Typography>
            <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, display: 'flex', fontWeight: 'bold'}}>
              {props.duration===0?<AllInclusiveIcon />:(oDateTime.hour().toString().padStart(2, '0')+':'+oDateTime.minute().toString().padStart(2, '0')+':'+oDateTime.second().toString().padStart(2, '0'))}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {fullQuiz?<Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        <Tooltip title={'refresh full quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz || loadingFullQuiz}
                      onClick={() => {
                        dispatch(sagaAdminGetQuiz({
                          quizId: props.id,
                        }));
                      }}
                      color="warning">
            <UpdateIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
      </Grid>:null}
      <Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        {(fullQuiz)?<Tooltip title={'view short quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz || loadingFullQuiz}
                      onClick={() => {setFullQuiz(false)}}
                      onMouseEnter={() => {setVisibleButton0(true)}}
                      onMouseLeave={() => {setVisibleButton0(false)}}
                      color="success">
            {visibleButton0?<CloseFullscreenIcon color="secondary" sx={{width: 32, height: 32}} />:<OpenInFullIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>:<Tooltip title={'view full quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz || loadingFullQuiz}
                      onClick={() => {
                        setFullQuiz(true);
                        dispatch(sagaAdminGetQuiz({
                          quizId: props.id,
                        }));
                      }}
                      onMouseEnter={() => {setVisibleButton0(true)}}
                      onMouseLeave={() => {setVisibleButton0(false)}}
                      color="secondary">
            {visibleButton0?<OpenInFullIcon color="success" sx={{width: 32, height: 32}} />:<CloseFullscreenIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>}
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        <Tooltip title={'view results'} arrow={true}>
          <IconButton component={NavLink} to={`/admin/quiz-results/${props.id}`}
                      size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz}
                      color="info">
            <TableRowsIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        <Tooltip title={'view questions'} arrow={true}>
          <IconButton component={NavLink} to={`/admin/quiz-questions/${props.id}`}
                      size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz}
                      color="primary">
            <EditNoteIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 2}}>
        {!props.draft?<Tooltip title={'hide quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz}
                      onClick={() => {
                        dispatch(sagaAdminEditQuizDraft({
                          quizId: props.id,
                          draft: true,
                        }))
                      }}
                      onMouseEnter={() => {setVisibleButton(true)}}
                      onMouseLeave={() => {setVisibleButton(false)}}
                      color="success">
            {visibleButton?<VisibilityOffIcon color="secondary" sx={{width: 32, height: 32}} />:<VisibilityIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>:<Tooltip title={'publish quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz}
                      onClick={() => {
                        dispatch(sagaAdminEditQuizDraft({
                          quizId: props.id,
                          draft: false,
                        }))
                      }}
                      onMouseEnter={() => {setVisibleButton(true)}}
                      onMouseLeave={() => {setVisibleButton(false)}}
                      color="secondary">
            {visibleButton?<VisibilityIcon color="success" sx={{width: 32, height: 32}} />:<VisibilityOffIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>}
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 2}}>
        <Tooltip title={'delete quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuizDraft || loadingDeleteQuiz}
                      onClick={() => {
                        setConfirmQuizDelete(true);
                      }}
                      color="error">
            <DeleteIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
        {confirmQuizDelete?<AdminDeleteConfirm  onClose={() => setConfirmQuizDelete(false)}
                                                title={'Dialog Confirm Delete Quiz'}
                                                message={`Are you sure you want to delete the quiz with ID "${props.id}" called "${props.quizname}"`}
                                                onSuccess={() => {
                                                  setConfirmQuizDelete(false);
                                                  dispatch(sagaAdminDeleteQuiz({
                                                    quizId: props.id,
                                                  }));
                                                }}/>:null}
      </Grid>
      {fullQuiz?<Grid xs={12}>
        {loadingFullQuiz?<Box>{'Loading...'}</Box>:<Grid container>
          <Grid item xs={12}>
            <Grid container sx={{rowGap: 1, m: 2}}>
              <Grid item xs={4}>{'ID'}</Grid>
              <Grid item xs={8}>{quiz._id}</Grid>
              <Grid item xs={4}>{'Author ID'}</Grid>
              <Grid item xs={8}>{quiz.author}</Grid>
              <Grid item xs={4}>{'Draft'}</Grid>
              <Grid item xs={8}>
                <Box sx={{fontWeight: 'bold', color: (props.draft?'secondary.main':'success.main')}}>
                  {Boolean(props.draft).toString()}
                </Box>
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Quiz title'}</Grid>
              <Grid item xs={8}>{quiz.quizname}</Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Quiz description'}</Grid>
              <Grid item xs={8}>{quiz.description}</Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Number of questions'}</Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>{quiz.questions.length}</Typography>
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Duration'}</Grid>
              <Grid item xs={8} sx={{color: 'warning.main'}}>
                {quiz.duration===0?<AllInclusiveIcon sx={{color: 'inherit'}} />
                                  :<Typography variant="body1" sx={{fontWeight: 'bold', color: 'inherit'}}>
                {(oDateTime.hour().toString().padStart(2, '0')+':'+oDateTime.minute().toString().padStart(2, '0')+':'+oDateTime.second().toString().padStart(2, '0'))}
                                  </Typography>}
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Number of Attempts per User'}</Grid>
              <Grid item xs={8}>
                {quiz.numberOfAttempts===0?<AllInclusiveIcon />:<Typography variant="body1" sx={{fontWeight: 'bold'}}>{quiz.numberOfAttempts}</Typography>}
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Number of Attempts (Done)'}</Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                  {quiz.attempts.filter((entry: any) => (entry.dateEnd || (quiz.duration !== 0 && (dayjs(entry.dateStart).utc().valueOf() + quiz.duration) <= Date.now()))).length}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Attempts (Done)'}</Grid>
              <Grid item xs={8} sx={{display: 'flex', gap: 1, flexWrap: 'wrap', pr: 0}}>
                {quiz.attempts.filter((entry: any) => (entry.dateEnd || (quiz.duration !== 0 && (dayjs(entry.dateStart).utc().valueOf() + quiz.duration) <= Date.now())))
                              .map((entry: any) => {
                  return (<Chip key={entry._id} sx={{height: 'auto', width: 'min-content'}} label={<Grid container sx={{pt: 1, pb: 1}}>
                    <Grid item xs={12}>{'attempt'}</Grid><Grid item xs={12}>{(entry._id + '').toString()}</Grid>
                    <Grid item xs={12}>{'user'}</Grid><Grid item xs={12}>{(entry.user + '').toString()}</Grid>
                  </Grid>} />);
                })}
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Number of Attempts (Process)'}</Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                  {quiz.attempts.filter((entry: any) => (quiz.duration === 0 && !entry.dateEnd) || (!entry.dateEnd && (quiz.duration !== 0 && (dayjs(entry.dateStart).utc().valueOf() + quiz.duration) > Date.now()))).length}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Attempts (Process)'}</Grid>
              <Grid item xs={8} sx={{display: 'flex', gap: 1, flexWrap: 'wrap', pr: 0}}>
                {quiz.attempts.filter((entry: any) => (quiz.duration === 0 && !entry.dateEnd) || (!entry.dateEnd && (quiz.duration !== 0 && (dayjs(entry.dateStart).utc().valueOf() + quiz.duration) > Date.now())))
                              .map((entry: any) => {
                  return (<Chip key={entry._id} sx={{height: 'auto', width: 'min-content'}} label={<Grid container sx={{pt: 1, pb: 1}}>
                    <Grid item xs={12}>{'attempt'}</Grid><Grid item xs={12}>{(entry._id + '').toString()}</Grid>
                    <Grid item xs={12}>{'user'}</Grid><Grid item xs={12}>{(entry.user + '').toString()}</Grid>
                  </Grid>} />);
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>}
      </Grid>:null}
    </Grid>
  </Paper>);
}
