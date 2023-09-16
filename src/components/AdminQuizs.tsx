import React, {useEffect, useState} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

import AddIcon from '@mui/icons-material/Add';

import {AlertError} from './AlertError';
import {CenterContent} from './CenterContent';

import {AdminQuizCreateDialog} from './AdminQuizCreateDialog';
import {AdminQuizItem} from './AdminQuizItem';

import {sagaAdminQuizs} from '../redux/sagas/admin.quizs';

export interface AdminQuizsProps {}

export const AdminQuizs: React.FC<AdminQuizsProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModalCreateQuiz, setShowModalCreateQuiz] = useState<boolean>(false);

  const errorQuizs = useSelector((state: any) => state.adminQuizs.errorQuizs);
	const quizs = useSelector((state: any) => state.adminQuizs.quizs);
  const loadQuizs = useSelector((state: any) => state.adminQuizs.loadQuizs);

  const loadCreateQuiz = useSelector((state: any) => state.adminQuizs.loadCreateQuiz);

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
		if(!user) {
			//navigate('/login');
		}
	}, [user]);

  useEffect(() => {
    dispatch(sagaAdminQuizs());
  }, []);

  return (<CenterContent>
    <Grid container sx={{alignSelf: 'start', pt: 1, pb: 1}}>
      <Grid item sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant="h4">Quizs</Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" color="success" size="large" sx={{minWidth: '135px'}}
                startIcon={<AddIcon color="inherit" sx={{width: 32, height: 32}} />}
                disabled={loadCreateQuiz?true:false}
                onClick={() => {
                  setShowModalCreateQuiz(true);
                }}>
          <Typography sx={{fontWeight: 'bold'}}>
            {'Add Quiz'}
          </Typography>
        </Button>
        {showModalCreateQuiz?<AdminQuizCreateDialog onClose={() => {
                                                      setShowModalCreateQuiz(false);
                                                    }}
                                                    onSuccess={() => {
                                                      setShowModalCreateQuiz(false);
                                                    }} />:null}
      </Grid>
      <Grid item xs={12}>
        <Grid container sx={{pt: 1, pb: 1}}>
          {loadQuizs?<Box>{'Loading...'}</Box>:(
            (quizs.length < 1)?<Box>{'Empty!!!'}</Box>:quizs.map((entry: any) => {
              return (<Grid item xs={12} key={entry._id}>
                <AdminQuizItem  id={entry._id}
                                quizname={entry.quizname}
                                duration={entry.duration}
                                numberOfAttempts={entry.numberOfAttempts}
                                questions={entry.questions}
                                draft={entry.draft}/>
              </Grid>);
            })
          )}
        </Grid>
      </Grid>
    </Grid>
  </CenterContent>);
}
