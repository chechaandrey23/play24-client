import React, {useEffect, useState} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

import {AlertError} from './AlertError';
import {CenterContent} from './CenterContent';

import {AdminQuestionCreateDialog} from './AdminQuestionCreateDialog';
import {AdminQuestionItem} from './AdminQuestionItem';

import {sagaAdminQuestions, sagaAdminOrderQuestions} from '../redux/sagas/admin.questions';
import {questionsWithOutSortOrder as questionsWithOutSortOrderAC} from '../redux/admin.questions';

export interface AdminQuizQuestionsProps {}

export const AdminQuizQuestions: React.FC<AdminQuizQuestionsProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModalCreateQuestion, setShowModalCreateQuestion] = useState<boolean>(false);

  const errorQuestions = useSelector((state: any) => state.adminQuestions.errorQuestions);
	const questions = useSelector((state: any) => state.adminQuestions.questions);
  const quiz = useSelector((state: any) => state.adminQuestions.quiz);
  const loadQuestions = useSelector((state: any) => state.adminQuestions.loadQuestions);

  const loadCreateQuestion = useSelector((state: any) => state.adminQuestions.loadCreateQuestion);

  const user = useSelector((state: any) => state.auth.user);

  const routeParams = useParams();

  const loadOrderQuestions = useSelector((state: any) => state.adminQuestions.loadOrderQuestion);
  const errorOrderQuestions = useSelector((state: any) => state.adminQuestions.errorOrderQuestion);

  useEffect(() => {
		if(!user) {
			//navigate('/login');
		}
	}, [user]);

  useEffect(() => {
    dispatch(sagaAdminQuestions({quizId: routeParams.quizId}));
  }, [routeParams]);

  const oDateTime = dayjs(quiz?.duration).utc();

  return (<CenterContent>
    <Grid container sx={{alignSelf: 'start', pt: 1, pb: 1}}>
      <Grid item xs={12}>
        <Grid container sx={{gap: 1}}>
          <Grid item sx={{display: 'flex', alignItems: 'start'}}>
            <Button variant="contained"
                    component={NavLink} to={`/admin/quizs`}
                    color="primary"
                    size="large"
                    startIcon={<ArrowBackIosNewIcon color="inherit" sx={{width: 32, height: 32}} />}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Back'}
              </Typography>
            </Button>
          </Grid>
          <Grid item sx={{flexGrow: 1}}>
            {(loadQuestions || !quiz)?<Box>{'Loading...'}</Box>:<Paper sx={{p: 1}}>
            <Grid container sx={{rowGap: 1}}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{quiz.quizname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">{quiz.description}</Typography>
              </Grid>
              <Grid item xs={5} sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{`ID: `}</Typography>
                <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{quiz._id}</Typography>
              </Grid>
              <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{'Duration: '}</Typography>
                <Typography variant={'body2'} sx={{color: 'text.secondary', ml: 1, display: 'flex', fontWeight: 'bold'}}>
                  {quiz.duration===0?<AllInclusiveIcon />:(oDateTime.hour().toString().padStart(2, '0')+':'+oDateTime.minute().toString().padStart(2, '0')+':'+oDateTime.second().toString().padStart(2, '0'))}
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{'Draft: '}</Typography>
                <Typography variant={'body2'} sx={{color: (quiz.draft?'secondary.main':'success.main'), ml: 1, fontWeight: 'bold'}}>{Boolean(quiz.draft).toString()}</Typography>
              </Grid>
            </Grid>
            </Paper>}
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'start', pl: 2, mt: 1}}>
        <Typography variant="h4">Questions</Typography>
      </Grid>
      <Grid item sx={{mt: 1}}>
        <Button variant="contained" color="success" size="large" sx={{minWidth: '135px'}}
                startIcon={<AddIcon color="inherit" sx={{width: 32, height: 32}} />}
                disabled={loadCreateQuestion?true:false}
                onClick={() => {
                  setShowModalCreateQuestion(true);
                }}>
          <Typography sx={{fontWeight: 'bold'}}>
            {'Add Question'}
          </Typography>
        </Button>
        {showModalCreateQuestion?<AdminQuestionCreateDialog onClose={() => {
                                                              setShowModalCreateQuestion(false);
                                                            }}
                                                            quizId={routeParams.quizId}
                                                            onSuccess={() => {
                                                              setShowModalCreateQuestion(false);
                                                            }} />:null}
      </Grid>
      <Grid item xs={12}>
        {loadOrderQuestions?<Box>{'Pleace wait, update order questions...'}</Box>:null}
        <DragDropContext onDragEnd={(result)=> {
          if (!result.destination) return;
          const newOrderQuestions = reorder(questions, result.source.index, result.destination.index);
          dispatch(questionsWithOutSortOrderAC(newOrderQuestions));
          dispatch(sagaAdminOrderQuestions({
            quizId: routeParams.quizId,
            orderQuestions: newOrderQuestions.map((entry: any, index: number) => ({id: entry._id, order: index+1})),
          }));
        }}>
          <Droppable droppableId="droppable">
            {(provided: any, snapshot: any) => (
              <Grid container sx={{pt: 1, pb: 1}} ref={provided.innerRef} {...provided.droppableProps}>
                {(questions.length < 1 && !loadQuestions)?<Box>{'Empty!!!'}</Box>:null}
                {loadQuestions?<Box>{'Loading...'}</Box>:questions.map((entry: any, index: number) => {
                  return (<Draggable key={entry._id} draggableId={entry._id} index={index}>
                    {(provided: any, snapshot: any) => (
                      <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <AdminQuestionItem  id={entry._id}
                                            quizId={quiz._id}
                                            draft={entry.draft}
                                            order={entry.order}
                                            questionType={entry.questionType}
                                            authorId={entry.author}
                                            answer={entry.answer}
                                            answerOptions={entry.answerOptions}
                                            question={entry.question}/>
                      </Grid>
                    )}
                  </Draggable>);
                })}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
    </Grid>
  </CenterContent>);
}

const reorder = (list: Array<any>, startIndex: number, endIndex: number): Array<any> => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
