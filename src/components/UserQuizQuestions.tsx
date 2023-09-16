import React, {useEffect} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

export interface UserQuizQuestionsProps {}

export const UserQuizQuestions: React.FC<UserQuizQuestionsProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  const errorCheckQuiz = useSelector((state: any) => state.userQuizs.errorCheckQuiz);
	const checkQuiz = useSelector((state: any) => state.userQuizs.checkQuiz);
  const loadCheckQuiz = useSelector((state: any) => state.userQuizs.loadCheckQuiz);



  // check quiz
  // get questions
  // finish quiz

  return (<>
    <h2>UserQuizQuestions</h2>
  </>);
}
