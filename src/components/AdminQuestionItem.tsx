import * as React from 'react';
import {useRef, useEffect, useCallback, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {Container, Grid, Box, Paper, Typography, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip, CircularProgress, Chip} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import UpdateIcon from '@mui/icons-material/Update';

import {sagaAdminDeleteQuestion} from '../redux/sagas/admin.questions';
import {sagaAdminEditQuestionDraft, sagaAdminGetQuestion} from '../redux/sagas/admin.questions';

import {AdminDeleteConfirm} from './AdminDeleteConfirm';

import {QUESTION_RANDOM_ANSWER, QUESTION_MATCH_ANSWER,
        QUESTION_MATCH_ANSWER_OPTIONS, QUESTION_MULTI_MATCH_ANSWER_OPTIONS} from '../config';

export interface AdminQuestionTypeInterface {
  _id: string;
  title: string;
  type: number;
}

export interface AdminQuestionItemProps {
  id: string;
  quizId: string;
  question: string;
  draft: boolean;
  order: number;
  questionType: AdminQuestionTypeInterface;
  authorId: string;
  answer?: string|Array<string>;
  answerOptions?: Array<string>;
}

export const AdminQuestionItem: React.FC<AdminQuestionItemProps> = (props) => {
  const dispatch = useDispatch();

  const [visibleButton, setVisibleButton] = useState<boolean>(false);
  const [visibleButton0, setVisibleButton0] = useState<boolean>(false);
  const [confirmQuestionDelete, setConfirmQuestionDelete] = useState<boolean>(false);
  const [fullQuestion, setFullQuestion] = useState<boolean>(false);

  const errorEditQuestionDraft = useSelector((state: any) => state.adminQuestions.errorEditQuestionDraft);
  const loadEditQuestionDraft = useSelector((state: any) => state.adminQuestions.loadEditQuestionDraft);

  const errorDeleteQuestion = useSelector((state: any) => state.adminQuestions.errorDeleteQuestion);
	//const deleteQuiz = useSelector((state: any) => state.adminQuizs.deleteQuiz);
  const loadDeleteQuestion = useSelector((state: any) => state.adminQuestions.loadDeleteQuestion);

  const fullQuestions = useSelector((state: any) => state.adminQuestions.fullQuestions);
  const loadFullQuestions = useSelector((state: any) => state.adminQuestions.loadFullQuestions);
  const errorFullQuestions = useSelector((state: any) => state.adminQuestions.errorFullQuestions);

  const loadingEditQuestionDraft = useMemo(() => loadEditQuestionDraft.includes(props.id), [loadEditQuestionDraft, props]);
  const loadingDeleteQuestion = useMemo(() => loadDeleteQuestion.includes(props.id), [loadDeleteQuestion, props]);
  const loadingFullQuestion = useMemo(() => loadFullQuestions.includes(props.id), [loadFullQuestions, props]);

  const question = fullQuestions[props.id];

  return (<Paper sx={{mt: 0.5, mb: 0.5, pt: 0.5, pb: 0.5}}>
    <Grid container>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, ml: 1, minWidth: '2em'}}>
        {(loadingEditQuestionDraft || loadingDeleteQuestion)?<Box>
          <CircularProgress color="warning" size='2em' />
        </Box>:<Box sx={{display: 'flex'}}>
          <Typography variant={'body1'} sx={{fontWeight: 'bold'}}>{'#'}</Typography>
          <Typography variant={'body1'} sx={{fontWeight: 'bold'}}>{props.order}</Typography>
        </Box>}
      </Grid>
      <Grid item sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
        <Grid container sx={{display: 'flex', alignItems: 'center'}}>
          <Grid item xs={12}><Typography variant={'body1'}>{props.question}</Typography></Grid>
          <Grid item xs={8} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`ID: `}</Typography>
            <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{props.id}</Typography>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`Type: `}</Typography>
            <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{props.questionType.title}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {fullQuestion?<Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        <Tooltip title={'refresh full question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion || loadingFullQuestion}
                      onClick={() => {
                        dispatch(sagaAdminGetQuestion({
                          quizId: props.quizId,
                          questionId: props.id,
                        }));
                      }}
                      color="warning">
            <UpdateIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
      </Grid>:null}
      <Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        {(fullQuestion)?<Tooltip title={'view short question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion || loadingFullQuestion}
                      onClick={() => {setFullQuestion(false)}}
                      onMouseEnter={() => {setVisibleButton0(true)}}
                      onMouseLeave={() => {setVisibleButton0(false)}}
                      color="success">
            {visibleButton0?<CloseFullscreenIcon color="secondary" sx={{width: 32, height: 32}} />:<OpenInFullIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>:<Tooltip title={'view full question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion || loadingFullQuestion}
                      onClick={() => {
                        setFullQuestion(true);
                        dispatch(sagaAdminGetQuestion({
                          quizId: props.quizId,
                          questionId: props.id,
                        }));
                      }}
                      onMouseEnter={() => {setVisibleButton0(true)}}
                      onMouseLeave={() => {setVisibleButton0(false)}}
                      color="secondary">
            {visibleButton0?<OpenInFullIcon color="success" sx={{width: 32, height: 32}} />:<CloseFullscreenIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>}
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 2}}>
        {!props.draft?<Tooltip title={'hide question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion}
                      onClick={() => {
                        dispatch(sagaAdminEditQuestionDraft({
                          questionId: props.id,
                          draft: true,
                        }))
                      }}
                      onMouseEnter={() => {setVisibleButton(true)}}
                      onMouseLeave={() => {setVisibleButton(false)}}
                      color="success">
            {visibleButton?<VisibilityOffIcon color="secondary" sx={{width: 32, height: 32}} />:<VisibilityIcon color="inherit" sx={{width: 32, height: 32}} />}
          </IconButton>
        </Tooltip>:<Tooltip title={'publish question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion}
                      onClick={() => {
                        dispatch(sagaAdminEditQuestionDraft({
                          questionId: props.id,
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
        <Tooltip title={'delete question'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={loadingEditQuestionDraft || loadingDeleteQuestion}
                      onClick={() => {
                        setConfirmQuestionDelete(true);
                      }}
                      color="error">
            <DeleteIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
        {confirmQuestionDelete?<AdminDeleteConfirm  onClose={() => setConfirmQuestionDelete(false)}
                                                    title={'Dialog Confirm Delete Question'}
                                                    message={`Are you sure you want to delete the question with ID "${props.id}" called "${props.question}"`}
                                                    onSuccess={() => {
                                                      setConfirmQuestionDelete(false);
                                                      dispatch(sagaAdminDeleteQuestion({
                                                        questionId: props.id,
                                                      }));
                                                    }}/>:null}
      </Grid>
      {fullQuestion?<Grid xs={12}>
        {loadingFullQuestion?<Box>{'Loading...'}</Box>:<Grid container>
          <Grid item xs={12}>
            <Grid container sx={{rowGap: 1, m: 2}}>
              <Grid item xs={4}>{'ID'}</Grid>
              <Grid item xs={8}>{question._id}</Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Order'}</Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>{props.order}</Typography>
              </Grid>
              <Grid item xs={4}>{'Author ID'}</Grid>
              <Grid item xs={8}>{question.author}</Grid>
              <Grid item xs={4}>{'Draft'}</Grid>
              <Grid item xs={8}>
                <Box sx={{fontWeight: 'bold', color: (props.draft?'secondary.main':'success.main')}}>
                  {Boolean(props.draft).toString()}
                </Box>
              </Grid>
              <Grid item xs={4}>{'Question'}</Grid>
              <Grid item xs={8}>{question.question}</Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Question Type'}</Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>{question.questionType.title}</Typography>
              </Grid>
              {(question.questionType.type === QUESTION_RANDOM_ANSWER)?<>
                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Answer'}</Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{'Random User Answer'}</Typography>
                </Grid>
              </>:null}
              {(question.questionType.type === QUESTION_MATCH_ANSWER_OPTIONS ||
                question.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?<>
                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Answer Options'}</Grid>
                <Grid item xs={8}>
                  <Box sx={{display: 'flex', gap: 1}}>
                    {question.answerOptions.map((item: string) => {
                      return (<Chip label={item} />)
                    })}
                  </Box>
                </Grid>
              </>:null}
              {(question.questionType.type === QUESTION_MATCH_ANSWER ||
                question.questionType.type === QUESTION_MATCH_ANSWER_OPTIONS ||
                question.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?<>
                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>{'Answer Correct'}</Grid>
                <Grid item xs={8}>
                  <Box sx={{display: 'flex', gap: 1}}>
                    {(Array.isArray(question.answer)?question.answer:[question.answer]).map((item: string) => {
                      return (<Chip label={item} />)
                    })}
                  </Box>
                </Grid>
              </>:null}
            </Grid>
          </Grid>
        </Grid>}
      </Grid>:null}
    </Grid>
  </Paper>);
}
