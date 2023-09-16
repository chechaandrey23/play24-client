import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack, Avatar} from '@mui/material';
import {useNavigate, useParams, NavLink, useSearchParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {LoadingButton} from '@mui/lab';
import {FormControl, FormHelperText, Select, MenuItem, ListItemText, Checkbox,
        OutlinedInput, InputLabel, Chip} from '@mui/material';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import queryString from 'query-string';
import {colors} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import UpdateIcon from '@mui/icons-material/Update';
import RefreshIcon from '@mui/icons-material/Refresh';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import GroupIcon from '@mui/icons-material/Group';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import {CenterContent} from './CenterContent';
import {AdminDeleteConfirm} from './AdminDeleteConfirm';

import {sagaAdminResults, sagaAdminResetResult} from '../redux/sagas/admin.results';

import {QUESTION_RANDOM_ANSWER, QUESTION_MATCH_ANSWER,
        QUESTION_MATCH_ANSWER_OPTIONS, QUESTION_MULTI_MATCH_ANSWER_OPTIONS} from '../config';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      //width: 250,
    },
  },
};

const STATUS_SHOW_ALL = 0;
const STATUS_SHOW_END = 1;
const STATUS_SHOW_PROGRESS = 2;

const statusValues = [
  {value: STATUS_SHOW_ALL, label: 'Show All'},
  {value: STATUS_SHOW_END, label: 'Show Completed'},
  {value: STATUS_SHOW_PROGRESS, label: 'Show in Progress'},
];

const STATUS_TIME_COMPLETED = 1;
const STATUS_TIME_EXPIRED = 2;
const STATUS_TIME_INFINITY = 3;
const STATUS_TIME_LEFT_TYME = 4;

const validationSchema = Yup.object().shape({
  status: Yup.number().oneOf(statusValues.map((entry) => entry.value)),
  users: Yup.array()
});

export interface AdminQuizResultsProps {}

export const AdminQuizResults: React.FC<AdminQuizResultsProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const [searchParams] = useSearchParams();

  const {register, handleSubmit, setValue, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);
  const usersLabelRef = useRef<any>(null);
  const mainRef = useRef<any>(null);

  const results = useSelector((state: any) => state.adminResults.results);
  const loadResults = useSelector((state: any) => state.adminResults.loadResults);
  const errorResults = useSelector((state: any) => state.adminResults.errorResults);

  const resetResult = useSelector((state: any) => state.adminResults.resetResult);
  const loadResetResult = useSelector((state: any) => state.adminResults.loadResetResult);
  const errorResetResult = useSelector((state: any) => state.adminResults.errorResetResult);

  const [iconStatusDisabled, setIconStatusDisabled] = useState<boolean>(false);
  const [iconUsersDisabled, setIconUsersDisabled] = useState<boolean>(false);

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    dispatch(sagaAdminResults({
      quizId: routeParams.quizId,
    }));
  }, [routeParams]);

  const newResults = useMemo(() => {
    if(results) {
      const newResults = {...results, users: []};
      results.attempts.forEach((entry: any) => {
        const user = entry.user;
        const index = newResults.users.findIndex((entry: any) => entry._id==user._id);
        if(index > -1) {
          newResults.users[index].newAttempts.push(entry);
        } else {
          newResults.users.push({...user, newAttempts: [entry]});
        }
      });
      return newResults;
    } else {
      return results;
    }
  }, [results]);

  const users = results?newResults.users.map((entry: any) => ({id: entry._id, username: entry.username})):[];

  const queryStatus: any = searchParams.get('status');
  const queryUsers = searchParams.getAll('users[]');

  const defaultStatus = queryStatus?queryStatus*1:STATUS_SHOW_ALL;
  const defaultUsers = queryUsers.length===0?users.map((entry: any) => entry.id):queryUsers;

  const filter = (<>
    {results?<Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
            console.log(data);
            navigate((`/admin/quiz-results/${routeParams.quizId}`)+'?'+queryString.stringify(data, {arrayFormat: 'bracket'}));
          })}>
      <Grid container sx={{gap: 1, display: 'flex', alignItems: 'center'}}>
        <Grid item sx={{pt: 0.5}}>
          <Controller control={control}
                      name="status"
                      defaultValue={defaultStatus}
                      render={({field, fieldState: {error}}) => (
                        <FormControl sx={{minWidth: '11em'}} variant="outlined" fullWidth={true} disabled={loadResults?true:false}>
                          <InputLabel htmlFor="adornment-status"
                                      sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                      error={!!errors.status}>
                            <Box sx={{display: 'flex'}}>
                              <SatelliteAltIcon sx={{display: iconStatusDisabled || field.value>=0?'none':'inline'}} />
                              <Typography sx={{pl: 1}}>{'Select Attempts'}</Typography>
                            </Box>
                          </InputLabel>
                          <Select {...field}
                                  id="adornment-status"
                                  sx={{height: '3.05em'}}
                                  multiple={false}
                                  value={field.value}
                                  onChange={(...args) => {
                                    field.onChange.call(null, ...args);
                                  }}
                                  input={<OutlinedInput label="Select attempts" />}
                                  renderValue={(selected) => {
                                    return (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                      {statusValues.filter((entry: any) => entry.value == selected).map((entry: any) => (
                                        /*<Chip key={entry._id} label={entry.title} />*/
                                        <Typography key={entry.value}>{entry.label}</Typography>
                                      ))}
                                    </Box>);
                                  }}
                                  error={!!errors.status}
                                  aria-describedby="status-helper-text"
                                  onFocus={(e: any) => {setIconStatusDisabled(true)}}
                                  onBlur={(e: any) => {setIconStatusDisabled(e.target.value>=0?true:false);}}
                                  MenuProps={menuProps}>
                            {statusValues.map((entry: any) => {
                              return (<MenuItem key={entry.value} value={entry.value}>
                                <Checkbox checked={field.value == entry.value} />
                                <ListItemText primary={entry.label} />
                              </MenuItem>);
                            })}
                          </Select>
                          <FormHelperText id="status-helper-text" error={!!errors.status}>
                            <Typography sx={{fontWeight: 'bold'}}>{errors.status?.message as any}</Typography>
                          </FormHelperText>
                        </FormControl>
                      )}/>
        </Grid>
        <Grid item sx={{pt: 0.5}}>
          <Controller control={control}
                      name="users"
                      defaultValue={defaultUsers}
                      render={({field, fieldState: {error}}) => (
                        <FormControl sx={{width: '13.5em'}} variant="outlined" fullWidth={true} disabled={loadResults?true:false}>
                          <InputLabel htmlFor="adornment-users" ref={usersLabelRef}
                                      sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1, mt: '-4px'}}
                                      error={!!errors.users}>
                            <Box sx={{display: 'flex'}}>
                              <GroupIcon sx={{display: iconUsersDisabled?'none':'inline'}} />
                              <Typography sx={{pl: 1}}>{'Select Users'}</Typography>
                            </Box>
                          </InputLabel>
                          <Select {...field}
                                  id="adornment-users"
                                  sx={{height: '3.05em'}}
                                  multiple={true}
                                  value={field.value}
                                  input={<OutlinedInput sx={{}} label="Select Users" />}
                                  renderValue={(selected) => {
                                    return (<Box sx={{display: 'flex', gap: 0.5}}>
                                      {users.filter((entry: any) => selected.indexOf(entry.id) > -1).map((entry: any) => (
                                        <Chip key={entry.id} label={entry.username} />
                                        /*<Typography>{entry.label}</Typography>*/
                                      ))}
                                    </Box>);
                                  }}
                                  error={!!errors.users}
                                  aria-describedby="users-helper-text"
                                  onFocus={(e) => {
                                    usersLabelRef.current.style.marginTop = 'unset';
                                    setIconUsersDisabled(true);
                                  }}
                                  onBlur={(e) => {
                                    usersLabelRef.current.style.marginTop = '-4px';
                                    setIconUsersDisabled(e.target.value.length?true:false);
                                  }}
                                  MenuProps={menuProps}>
                            {users.map((entry: any) => {
                              return (<MenuItem key={entry.id} value={entry.id}>
                                <Checkbox checked={(field.value || []).indexOf(entry.id) > -1} />
                                <ListItemText primary={<Grid container sx={{flexDirection: 'column'}}>
                                  <Grid item><Typography variant="body1">{entry.username}</Typography></Grid>
                                  <Grid item><Typography variant="body2" sx={{color: 'text.secondary'}}>{entry.id}</Typography></Grid>
                                </Grid>} />
                              </MenuItem>);
                            })}
                          </Select>
                          <FormHelperText id="users-helper-text" error={!!errors.users}>
                            <Typography sx={{fontWeight: 'bold'}}>{errors.users?.message as any}</Typography>
                          </FormHelperText>
                        </FormControl>
                      )}/>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" size="large"
                               startIcon={<FilterAltIcon color="inherit" sx={{width: 32, height: 32}} />}
                               disabled={loadResults}
                               onClick={() => {
                                 formRef.current.requestSubmit();
                               }}>
            <Typography sx={{fontWeight: 'bold'}}>
              {'Filter'}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>:null}
  </>);

  useEffect(() => {
    const fn = (e: any) => {
      if(!e.shiftKey) return;
      e.preventDefault();
      mainRef.current.scrollLeft += e.deltaY;
    }
    if(mainRef.current) mainRef.current.addEventListener('wheel', fn);
    return () => {
      if(mainRef.current) mainRef.current.removeEventListener('wheel', fn);
    }
  }, [loadResults]);

  const header00Ref = useRef<any>(null);
  const [header, setHeader] = useState<any>({});

  useEffect(() => {
    if(header00Ref.current) {
      setHeader(header00Ref.current.getBoundingClientRect());
    }
  }, [loadResults]);

  const [confirmAttemptReset, setConfirmAttemptReset] = useState<any>([]);

  return (<CenterContent>
    <Grid container sx={{alignSelf: 'start'}}>
      <Grid item xs={12} sx={{pt: 1}}>
        <Paper sx={{p: 1}}>
          <Grid container sx={{gap: 1, display: 'flex', alignItems: 'center'}}>
            <Grid item>
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
            {isLg?<Grid item>{filter}</Grid>:null}
            <Grid item>
              {!loadResults?<Button variant="contained" color="warning" size="large"
                                   startIcon={<UpdateIcon color="inherit" sx={{width: 32, height: 32}} />}
                                   onClick={() => {
                                     dispatch(sagaAdminResults({
                                       quizId: routeParams.quizId,
                                     }));
                                   }}>
                <Typography sx={{fontWeight: 'bold'}}>
                  {'Update'}
                </Typography>
              </Button>:<LoadingButton loading
                                       size="large"
                                       loadingPosition="start"
                                       startIcon={<RefreshIcon color="inherit" sx={{width: 32, height: 32}} />}
                                       variant="outlined">
                <Typography sx={{fontWeight: 'bold'}}>
                  {'Updating...'}
                </Typography>
              </LoadingButton>}
            </Grid>
            <Grid item sx={{flexGrow: 1}}></Grid>
            <Grid item>
              <Tooltip title={<Typography variant="body1" sx={{fontWeight: 'bold'}}>{'shift + scroll => horizontal scroll'}</Typography>} arrow={true}>
                <Fab color="primary" aria-label="help">
                  <QuestionMarkIcon sx={{width: '1.7em', height: '1.7em'}} />
                </Fab>
              </Tooltip>
            </Grid>
            {!isLg?<Grid item xs={12}>{filter}</Grid>:null}
          </Grid>
        </Paper>
      </Grid>
      {loadResults || !results?<Grid item>{'Loading...'}</Grid>:<Grid item xs={12} sx={{pt: 1, pb: 1}}>
        <Paper className="ResultsTable" ref={mainRef} sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          cursor: 'default',
          '& .ItemResult, & .ItemQuestion': {height: '6em'},
          '& .ItemHeader': {height: '9em'},
          '& .ItemHeaderUser': {height: '3em', minWidth: '15em'},
          '& .ItemHeaderAttempt': {height: '6em', width: '15em'},
          '& .ItemResult': {width: '15em'},
          '& .ItemQuestion:nth-child(even), & .ItemResult:nth-child(even)': {
            backgroundColor: colors.teal[50]
          },
        }}>
        <Grid container sx={{width: 'max-content'}}>
          <Grid item>
            <Grid container sx={{flexDirection: 'column'}}>
              <Grid item className="ItemHeader" ref={header00Ref} sx={{position: 'relative', outlineRight: '1px solid black'}}>
                <Box sx={{position: 'absolute', top: 0, left: 0}}>
                  <svg width={header.width} height={header.height} xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <line stroke="#000" id="svg_2" y2="0" x2="0" y1={header.height} x1={header.width} fill="none"/>
                    </g>
                  </svg>
                </Box>
                <Box sx={{position: 'absolute', bottom: 0, left: 10, p: 2}}>
                  <Typography variant="h5" sx={{fontWeight: 'bold'}}>{'questions'}</Typography>
                </Box>
                <Box sx={{position: 'absolute', top: 0, right: 10, p: 2}}>
                  <Typography variant="h5" sx={{fontWeight: 'bold'}}>{'attempts'}</Typography>
                </Box>
              </Grid>
              {results.questions.map((entry: any, index: number) => {
                return (<Grid item key={entry._id} className={`ItemQuestion ItemRow-${index}`} sx={{
                  width: '23em'
                }}>
                  <Grid container sx={{flexDirection: 'column', height: '100%', width: 'inherit', p: 0.5}}>
                    <Grid item sx={{display: 'flex'}}>
                      <Typography variant="body1">{'Question'}</Typography>
                      <Typography variant="body1" sx={{fontWeight: 'bold', ml: 1}}>{'#'+(entry.order)}</Typography>
                    </Grid>
                    <Grid item className="ResultsTableItem" sx={{height: '2.5em', overflow: 'auto', pl: 0.5}}>
                      <Typography variant="body2">{entry.question}</Typography>
                    </Grid>
                    <Grid item sx={{flexGrow: 1}}></Grid>
                    <Grid item>
                      <Grid container sx={{gap: 1, justifyContent: 'start'}}>
                        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                          <Typography variant="body1" sx={{}}>{'Type: '}</Typography>
                          <Typography variant="body2" sx={{ml: 1, fontWeight: 'bold'}}>{entry.questionType.title}</Typography>
                        </Grid>
                        <Grid item sx={{flexGrow: 1}}></Grid>
                        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                          <Typography variant="body1" sx={{}}>{'ID: '}</Typography>
                          <Typography variant="body2" sx={{ml: 1, color: 'text.secondary'}}>{entry._id}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>);
              })}
              <Grid item>{'Total'}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container>
              {newResults.users.map((user: any) => {
                if(defaultUsers.indexOf(user._id) === -1) return null;

                const filtred = user.newAttempts.filter((attempt: any) => {
                  const ended = (attempt.dateEnd)
                    || (attempt.dateEnd && results.duration===0)
                    || (results.duration>0 && dayjs(attempt.dateStart).valueOf()+results.duration < Date.now());
                  if((defaultStatus===STATUS_SHOW_END && !ended) || (defaultStatus===STATUS_SHOW_PROGRESS && ended)) return false;
                  return true;
                });

                if(filtred.length === 0) return null;

                return (<Grid item key={user._id}>
                  <Grid container sx={{flexDirection: 'column'}}>
                        <Grid item className="ItemHeaderUser" sx={{display: 'flex', alignItems: 'center'}}>
                          <Grid container>
                            <Grid item sx={{mr: 1, ml: 1, fontWeight: 'bold'}}>
                              <Avatar {...stringAvatar(user.username)} />
                            </Grid>
                            <Grid item>
                              <Grid container sx={{flexDirection: 'column'}}>
                                <Grid item>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{user.username}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2" sx={{color: 'text.secondary'}}>{user._id}</Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container>
                        {user.newAttempts.map((attempt: any, index: number) => {
                          const stats: Array<any> = [];
                          const stats2: Array<any> = [];
                          const ended = (attempt.dateEnd)
                            || (attempt.dateEnd && results.duration===0)
                            || (results.duration>0 && dayjs(attempt.dateStart).valueOf()+results.duration < Date.now());
                          if((defaultStatus===STATUS_SHOW_END && !ended) || (defaultStatus===STATUS_SHOW_PROGRESS && ended)) return null;

                          const oDateTime = dayjs(dayjs(attempt.dateStart).valueOf()+results.duration-Date.now()).utc();
                          const endStatus = attempt.dateEnd
                            ?{value: STATUS_TIME_COMPLETED, label: 'Ended'}
                            :(!attempt.dateEnd && results.duration===0)
                              ?{value: STATUS_TIME_INFINITY, label: 'Infinity'}
                              :(dayjs(attempt.dateStart).valueOf()+results.duration >= Date.now())
                                ?{value: STATUS_TIME_LEFT_TYME, label: <Box sx={{display: 'flex'}}>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{oDateTime.hour().toString().padStart(2, '0')}</Typography>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{':'}</Typography>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{oDateTime.minute().toString().padStart(2, '0')}</Typography>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{':'}</Typography>
                                  <Typography variant="body1" sx={{fontWeight: 'bold'}}>{oDateTime.second().toString().padStart(2, '0')}</Typography>
                                </Box>}
                                :{value: STATUS_TIME_EXPIRED, label: 'Expired'};

                          return (<Grid item key={attempt._id} sx={{
                            //'&:hover': {backgroundColor: colors.yellow[100]}
                          }}>
                            <Grid container sx={{flexDirection: 'column'}}>
                              <Grid item className="ItemHeaderAttempt" sx={{display: 'flex'}}>
                                <Grid container sx={{alignItems: 'center', m: 0.5}}>
                                  <Grid item sx={{pr: 0.5, pl: 0.5}}>
                                    {ended?<SportsScoreIcon sx={{width: '1.5em', height: '1.5em'}} />:<DirectionsRunIcon sx={{width: '1.5em', height: '1.5em'}} />}
                                  </Grid>
                                  <Grid item>
                                    <Grid container sx={{flexDirection: 'column'}}>
                                      <Grid item sx={{display: 'flex'}}>
                                        <Typography variant="body1">{'attempt'}</Typography>
                                        <Typography variant="body1" sx={{fontWeight: 'bold', ml: 1}}>{'#'+(index+1)}</Typography>
                                      </Grid>
                                      <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                        {endStatus.value===STATUS_TIME_COMPLETED
                                          ?<>
                                            <Box><ChecklistIcon sx={{color: 'success.main'}} /></Box>
                                            <Box><Typography variant="body1" sx={{fontWeight: 'bold', ml: 1, color: 'success.main'}}>{endStatus.label}</Typography></Box>
                                          </>:(endStatus.value===STATUS_TIME_INFINITY
                                            ?<>
                                              <Box><AllInclusiveIcon sx={{color: 'secondary.main'}} /></Box>
                                              <Box><Typography variant="body1" sx={{fontWeight: 'bold', ml: 1, color: 'secondary.main'}}>{endStatus.label}</Typography></Box>
                                            </>
                                            :(endStatus.value===STATUS_TIME_EXPIRED
                                              ?<>
                                                <Box><TimerOffIcon sx={{color: 'info.main'}} /></Box>
                                                <Box><Typography variant="body1" sx={{fontWeight: 'bold', ml: 1, color: 'info.main'}}>{endStatus.label}</Typography></Box>
                                              </>
                                              :(endStatus.value===STATUS_TIME_LEFT_TYME?<>
                                                <Box><TimerIcon sx={{color: 'warning.main'}} /></Box>
                                                <Box sx={{color: 'warning.main'}}>{endStatus.label}</Box>
                                              </>:null)
                                            ))}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item sx={{flexGrow: 1}}></Grid>
                                  <Grid item sx={{mr: 1.5}}>
                                    <Tooltip title={'reset attempt'} arrow={true}>
                                      <IconButton size="large"
                                                  edge="end"
                                                  disabled={loadResetResult.includes(attempt._id)}
                                                  onClick={() => {
                                                    setConfirmAttemptReset([...confirmAttemptReset, attempt._id]);
                                                  }}
                                                  color="error">
                                        <DeleteIcon color="inherit" sx={{width: 32, height: 32}} />
                                      </IconButton>
                                    </Tooltip>
                                    {confirmAttemptReset.indexOf(attempt._id) > -1?<AdminDeleteConfirm  onClose={
                                      () => setConfirmAttemptReset([...confirmAttemptReset.filter((item: any) => item!==attempt._id)])
                                    }
                                                                              title={'Dialog Confirm Reset Attempt'}
                                                                              message={`Are you sure you want to reset the attemp with ID "${attempt._id}"`}
                                                                              confirmButtonTitle={'Reset'}
                                                                              onSuccess={() => {
                                                                                setConfirmAttemptReset([...confirmAttemptReset.filter((item: any) => item!==attempt._id)]);
                                                                                dispatch(sagaAdminResetResult({
                                                                                  quizId: routeParams.quizId,
                                                                                  userId: user._id,
                                                                                  attemptId: attempt._id,
                                                                                }));
                                                                              }}/>:null}
                                  </Grid>
                                  <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                                    <Typography variant="body1">{'ID: '}</Typography>
                                    <Typography variant="body2" sx={{color: 'text.secondary', ml: 1}}>{attempt._id}</Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              {results.questions.map((question: any, index: number) => {
                                const answer = attempt.results.find((entry: any) => question._id==entry.question);

                                stats.push({question: index+1, answer: !!answer});

                                let isCorrectAnswer = false;
                                if(question.questionType.type!==QUESTION_RANDOM_ANSWER) {
                                  if(answer) {
                                    if(question.questionType.type===QUESTION_MULTI_MATCH_ANSWER_OPTIONS) {
                                      isCorrectAnswer = compareArrays(question.answer, answer.userAnswer);
                                    } else {
                                      isCorrectAnswer = question.answer==answer.userAnswer;
                                    }
                                  }
                                  stats2.push({question: index+1, isCorrectAnswer: isCorrectAnswer});
                                }



                                return (<Grid item key={question._id} sx={{p: 0.5}} className={`ItemResult ItemRow-${index}`}>
                                  {!answer?<AdminQuizResultItem icon={<CheckBoxOutlineBlankIcon sx={{width: '1.5em', height: '1.5em'}} />}
                                                         answer={null}
                                                         answerColor={'error.main'}
                                                         isShouldAnswerRandom={question.questionType.type===QUESTION_RANDOM_ANSWER}
                                                         shouldAnswerRandomColor={'info.main'}
                                                         shouldAnswer={question.answer}/>:(
                                    question.questionType.type===QUESTION_RANDOM_ANSWER
                                      ?<AdminQuizResultItem icon={<CheckBoxIcon sx={{width: '1.5em', height: '1.5em', color: 'primary.contrastText'}} />}
                                                            backgroundColor={'primary.light'}
                                                            answer={answer.userAnswer}
                                                            answerColor={'primary.contrastText'}
                                                            isShouldAnswerRandom={true}
                                                            shouldAnswerRandomColor={'primary.contrastText'}
                                                            shouldAnswer={question.answer}
                                                            shouldAnswerColor={'primary.contrastText'}
                                                            resultId={answer._id}
                                                            resultIdColor={'primary.contrastText'}/>
                                      :(isCorrectAnswer
                                        ?<AdminQuizResultItem icon={<CheckBoxIcon sx={{width: '1.5em', height: '1.5em', color: 'success.contrastText'}} />}
                                                              backgroundColor={'success.light'}
                                                              answer={answer.userAnswer}
                                                              answerColor={'success.contrastText'}
                                                              shouldAnswer={question.answer}
                                                              shouldAnswerColor={'success.contrastText'}
                                                              resultId={answer._id}
                                                              resultIdColor={'success.contrastText'}/>
                                        :<AdminQuizResultItem icon={<IndeterminateCheckBoxIcon sx={{width: '1.5em', height: '1.5em', color: 'error.contrastText'}} />}
                                                              backgroundColor={'error.light'}
                                                              answer={answer.userAnswer}
                                                              answerColor={'error.contrastText'}
                                                              shouldAnswer={question.answer}
                                                              shouldAnswerColor={'error.contrastText'}
                                                              resultId={answer._id}
                                                              resultIdColor={'error.contrastText'}/>
                                      )
                                  )}
                                </Grid>);
                              })}
                              <Grid item>
                                <Grid container sx={{flexDirection: 'column'}}>
                                  <Grid item>{'questios/answers'}</Grid>
                                  <Grid item>{`${stats.length}/${stats.filter((entry: any) => entry.answer).length}`}</Grid>
                                  <Grid item>{'questios/corr.answers'}</Grid>
                                  <Grid item>{`${stats2.length}/${stats2.filter((entry: any) => entry.isCorrectAnswer).length}`}</Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>);
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>);
              })}
            </Grid>
          </Grid>
        </Grid>
      </Paper></Grid>}
      <Grid item></Grid>
    </Grid>
  </CenterContent>);
}

export interface AdminQuizResultItemProps {
  backgroundColor?: string;
  icon?: any;
  answer?: any;
  answerColor: string;
  isShouldAnswerRandom?: boolean;
  shouldAnswerRandomColor?: string;
  shouldAnswer?: any;
  shouldAnswerColor?: string;
  resultId?: string;
  resultIdColor?: string;
}

export const AdminQuizResultItem: React.FC<AdminQuizResultItemProps> = (props) => {

  return (<Grid container className="ResultsTableItem" sx={{height: '100%', backgroundColor: props.backgroundColor ?? 'unset', overflowY: 'auto'}}>
    <Grid item sx={{display: 'flex', alignItems: 'center'}}>
      <Grid container sx={{flexWrap: 'nowrap'}}>
        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', pr: 0.5, pl: 0.5}}>
          {props.icon ?? <Box sx={{width: '1.5em', height: '1.5em'}}></Box>}
        </Grid>
        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
          <Grid container sx={{flexDirection: 'column'}}>
            <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
              <Typography variant="body1">{'Answer: '}</Typography>
              <Typography variant="body1" sx={{ml: 1, fontWeight: 'bold', color: props.answerColor ?? 'unset'}}>
                {props.answer?(Array.isArray(props.answer)?props.answer.join(', '):props.answer):'Unknown'}
              </Typography>
            </Grid>
            <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
              <Typography variant="body1">{'Should: '}</Typography>
              {!props.isShouldAnswerRandom
                ?<Typography variant="body1" sx={{ml: 1, fontWeight: 'bold', color: props.shouldAnswerColor ?? 'unset'}}>
                  {Array.isArray(props.shouldAnswer)?props.shouldAnswer.join(', '):props.shouldAnswer}
                </Typography>
                :<Typography variant="body1" sx={{ml: 1, fontWeight: 'bold', color: props.shouldAnswerRandomColor ?? 'info.main'}}>{'Random'}</Typography>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', pl: 0.5, pr: 0.5}}>
      <Typography variant="body1">{'ID: '}</Typography>
      <Typography variant="body2" sx={{ml: 1, color: props.resultIdColor ?? 'text.secondary'}}>{props.resultId ?? 'UNKNOWN'}</Typography>
    </Grid>
  </Grid>);
}

const compareArrays = (a: Array<any>, b: Array<any>): boolean => {
  if(a.length !== b.length) return false;
  a = [...a].sort((a: any, b: any) => (a+'').localeCompare(''+b));
  b = [...b].sort((a: any, b: any) => (a+'').localeCompare(''+b));
  return a.every((item: any, index: number) => item == b[index]);
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.toUpperCase()[0]}`//`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
