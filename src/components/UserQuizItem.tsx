import * as React from 'react';
import {useRef, useEffect, useCallback, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {Container, Grid, Box, Paper, Typography, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip, CircularProgress} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Menu, MenuItem, ListItemText, ListItemIcon} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import TableRowsIcon from '@mui/icons-material/TableRows';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import {sagaUserQuizCreateAttempt} from '../redux/sagas/user.quizs';
import {errorCreateQuizAttempt as errorCreateQuizAttemptAC, createQuizAttempt as createQuizAttemptAC} from '../redux/user.quizs';

import {MyTimer} from './MyTimer';

export interface UserQuizAttemptInterface {
  _id: string;
  dateStart: string;
  dateEnd?: string;
  irRelevant: boolean;
}

export interface UserQuizItemProps {
  id: string;
  quizname: string;
  attempts: Array<UserQuizAttemptInterface>;
  duration: number;
  numberOfAttempts: number;
  questions: Array<string>;
}

export const UserQuizItem: React.FC<UserQuizItemProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null);

  const loadCreateQuizAttempt = useSelector((state: any) => state.userQuizs.loadCreateQuizAttempt);
  /*
  const errorCreateQuizAttempt = useSelector((state: any) => state.userQuizs.errorCreateQuizAttempt);
	const createQuizAttempt = useSelector((state: any) => state.userQuizs.createQuizAttempt);
  const loadCreateQuizAttempt = useSelector((state: any) => state.userQuizs.loadCreateQuizAttempt);

  useEffect(() => {
    if(createQuizAttempt) {
      dispatch(createQuizAttemptAC(null));
      navigate(`/user/quiz-questions/${props.id}/${createQuizAttempt._id}`);// add questionId
    }
  }, [createQuizAttempt]);
  onClick={() => {
   dispatch(sagaUserQuizCreateAttempt({quizId: props.id}));
 }}
  */
  const handleClose = () => {
    setAnchorEl(null);
  };

  const oDateTime = dayjs(props.duration).utc();

  return (<Paper sx={{mt: 0.5, mb: 0.5, pt: 0.5, pb: 0.5}}>
    <Grid container>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, ml: 1, minWidth: '2em'}}>

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
      <Grid item sx={{display: 'flex', alignItems: 'center', pr: 2}}>
        <Tooltip title={'view results'} arrow={true}>
          <IconButton component={NavLink} to={`/user/quiz-results/${props.id}`}
                      size="large"
                      edge="end"
                      disabled={false}
                      color="primary">
            <TableRowsIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 2}}>
        {(props.attempts.length>0)?<><Tooltip title={'go attempts quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={false}
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(e.currentTarget);
                      }}
                      color="success">
          <VideoSettingsIcon color="inherit" sx={{width: 32, height: 32}} />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl}
            id="attempts-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transitionDuration={0}
            PaperProps={{
              style: {
                maxHeight: 'calc(30vh)',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {props.attempts.map((entry: UserQuizAttemptInterface) => {
          const dateStart = dayjs(entry.dateStart);
          const ended = !!(entry.dateEnd || (props.duration !== 0 && (dateStart.valueOf() + props.duration) <= Date.now()));

          return (<MenuItem key={entry._id}
                            disabled={ended}
                            component={NavLink} to={props.questions.length>0
                              ?`/user/quiz-questions/${props.id}/${props.questions[0]}/${entry._id}`
                              :`/user/quiz/${props.id}/finish/${entry._id}`}
                            sx={{pt:1, pb: 1}}>
            <ListItemIcon>
              <ChecklistRtlIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>
              <Typography>{entry._id}</Typography>
            </ListItemText>
            {props.duration === 0?(<Box sx={{pl: 1, display: 'flex', justifyContent: 'center'}}>
              <AllInclusiveIcon />
            </Box>):(!ended?(<Box sx={{pl: 1}}>
              <MyTimer dateEnd={dateStart.valueOf()+props.duration} />
            </Box>):(entry.dateEnd?<Box sx={{pl: 1, color: 'success.main', fontWeight: 'bold'}}><DoneAllIcon /></Box>:<Box sx={{pl: 1, color: 'secondary.main', fontWeight: 'bold'}}><Typography>{'expired'}</Typography></Box>))}
          </MenuItem>);
        })}
        {(props.numberOfAttempts === 0 || props.numberOfAttempts > props.attempts.length)?(loadCreateQuizAttempt?<MenuItem disabled={true} sx={{pt:1, pb: 1}}>
          <ListItemIcon>
            <CircularProgress color="inherit" size='1em' />
          </ListItemIcon>
          <ListItemText sx={{textAlign: 'center'}}>
            pleace wait...
          </ListItemText>
        </MenuItem>:<MenuItem component={NavLink} to={`/user/quiz/${props.id}/start`}
                  sx={{pt:1, pb: 1}}>
          <ListItemIcon>
            <AddBoxIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText sx={{textAlign: 'center'}}>
            new attempt
          </ListItemText>
        </MenuItem>):null}
      </Menu>
      </>:(!loadCreateQuizAttempt?<Tooltip title={'go quiz'} arrow={true}>
          <IconButton size="large"
                      edge="end"
                      disabled={false}
                      component={NavLink} to={`/user/quiz/${props.id}/start`}
                      color="success">
            <PlayArrowIcon color="inherit" sx={{width: 32, height: 32}} />
          </IconButton>
        </Tooltip>:<IconButton  size="large"
                                edge="end"
                                color="warning">
          <CircularProgress color="inherit" size='1em' />
        </IconButton>)}
      </Grid>
    </Grid>
  </Paper>);
}
