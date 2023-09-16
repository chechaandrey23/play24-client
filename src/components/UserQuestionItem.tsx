import React, {useEffect, useState, useRef} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack, CircularProgress} from '@mui/material';
import {FormControl, FormHelperText, OutlinedInput, InputLabel, RadioGroup, Radio,
        FormControlLabel, FormLabel, FormGroup, Checkbox} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Stepper, Step, StepButton, StepLabel, StepIcon} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import SaveAsIcon from '@mui/icons-material/SaveAs';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import TimerIcon from '@mui/icons-material/Timer';

import {sagaUserQuestions, sagaUserGetQuestion, sagaUserSetQuestion, sagaUserFullQuiz} from '../redux/sagas/user.questions';
import {errorEditCurrentQuestion as errorEditCurrentQuestionAC, editCurrentQuestion as editCurrentQuestionAC} from '../redux/user.questions';

import {CenterContent} from './CenterContent';
import {MyTimer} from './MyTimer';
import {AlertError} from './AlertError';

import {QUESTION_RANDOM_ANSWER, QUESTION_MATCH_ANSWER,
        QUESTION_MATCH_ANSWER_OPTIONS, QUESTION_MULTI_MATCH_ANSWER_OPTIONS} from '../config';

const validationSchema = Yup.object().shape({
  questionType: Yup.number().required('Question Type is required')
                            .oneOf([QUESTION_RANDOM_ANSWER,
                                    QUESTION_MATCH_ANSWER,
                                    QUESTION_MATCH_ANSWER_OPTIONS,
                                    QUESTION_MULTI_MATCH_ANSWER_OPTIONS], 'QuestionType type is incorrect!!!'),
  answer: Yup.string().when('questionType', {
    is: (value: any) => (value == QUESTION_RANDOM_ANSWER || value == QUESTION_MATCH_ANSWER),
    then: (schema) => schema.required('Answer id is required')
                            .min(1, 'Answer must be at least 1 characters')
                            .max(255, 'Answer must not exceed 255 characters'),
  }),
  answerSelect: Yup.string().when('questionType', {
    is: (value: any) => (value == QUESTION_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer Select id is required')
                            .min(1, 'Answer Select must be at least 1 characters')
                            .max(255, 'Answer Select must not exceed 255 characters')
                            .test('answerInOptions',
                                  'The answer should be in the answer options',
                                  (value, ctx) => {
                                    const o = ctx.parent.answerOptions;//.map((entry: any) => entry.value);
                                    return o.includes(value);
                                  })
  }),
  answerArray: Yup.array().when('questionType', {
    is: (value: any) => (value == QUESTION_MULTI_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer Array id is required')
                            .min(1, 'At least one Answer Array must be selected')
                            .max(20, 'You cannot select more than 20 elements')
                            .test('answerArrayInOptions',
                                  'The Answer Array should be in the answer options',
                                  (value, ctx) => {
                                    const o = ctx.parent.answerOptions;//.map((entry: any) => entry.value);
                                    return value.filter((item) => o.includes(item)).length == value.length;
                                  })
  }),
  answerOptions: Yup.array().when('questionType', {
    is: (value: any) => (value == QUESTION_MATCH_ANSWER_OPTIONS || value == QUESTION_MULTI_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer Options is required')
                            .min(1, 'At least one Answer Options must be selected')
                            .max(20, 'You cannot select more than 20 options')
                            .of(
                              Yup.string().required('Answer Option is required')
                                          .min(1, 'Answer Option must be at least 1 characters')
                                          .max(255, 'Answer Option must not exceed 255 characters')
                            )
  }),
});

export interface UserQuestionItemProps {}

export const UserQuestionItem: React.FC<UserQuestionItemProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();

  const {register, handleSubmit, setValue, clearErrors, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);

  //const errorCurrentQuestion = useSelector((state: any) => state.userQuestions.errorCurrentQuestion);
	//const currentQuestion = useSelector((state: any) => state.userQuestions.currentQuestion);
  //const loadCurrentQuestion = useSelector((state: any) => state.userQuestions.loadCurrentQuestion);

  const errorEditCurrentQuestion = useSelector((state: any) => state.userQuestions.errorEditCurrentQuestion);
	const editCurrentQuestion = useSelector((state: any) => state.userQuestions.editCurrentQuestion);
  const loadEditCurrentQuestion = useSelector((state: any) => state.userQuestions.loadEditCurrentQuestion);

  //const errorQuestions = useSelector((state: any) => state.userQuestions.errorQuestions);
	//const questions = useSelector((state: any) => state.userQuestions.questions);
  //const loadQuestions = useSelector((state: any) => state.userQuestions.loadQuestions);

  const fullQuiz = useSelector((state: any) => state.userQuestions.fullQuiz);
  const fullQuizQuestions = useSelector((state: any) => state.userQuestions.fullQuizQuestions);
  const fullQuizQuestion = useSelector((state: any) => state.userQuestions.fullQuizQuestion);
  const loadFullQuiz = useSelector((state: any) => state.userQuestions.loadFullQuiz);
  const errorFullQuiz = useSelector((state: any) => state.userQuestions.errorFullQuiz);

  const [iconAnswerDisabled, setIconAnswerDisabled] = useState<boolean>(false);

  useEffect(() => {
    dispatch(sagaUserFullQuiz({
      quizId: routeParams.quizId,
      questionId: routeParams.questionId,
      attemptId: routeParams.attemptId,
    }));
  }, [routeParams]);
  /*
  useEffect(() => {
    dispatch(sagaUserGetQuestion({
      quizId: routeParams.quizId,
      questionId: routeParams.questionId,
      attemptId: routeParams.attemptId,
    }));
  }, [routeParams]);

  useEffect(() => {
    dispatch(sagaUserQuestions({
      quizId: routeParams.quizId,
      attemptId: routeParams.attemptId,
    }));
  }, [routeParams]);
  */
  const mainRef = useRef<any>(null);

  const activeElRef = useRef<any>(null);

  useEffect(() => {
    if(activeElRef.current) activeElRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [loadFullQuiz]);

  //const currentQuestionIndex = questions.findIndex((entry: any) => entry._id === routeParams.questionId);
  const currentQuestionIndex = fullQuizQuestions.findIndex((entry: any) => entry._id === routeParams.questionId);

  useEffect(() => {
    const fn = (e: any) => {
      e.preventDefault();
      mainRef.current.scrollLeft += e.deltaY;
    }
    if(mainRef.current) mainRef.current.addEventListener('wheel', fn);
    return () => {
      if(mainRef.current) mainRef.current.removeEventListener('wheel', fn);
    }
  }, [loadFullQuiz]);

  useEffect(() => {
    if(fullQuizQuestion) {
      const type = fullQuizQuestion.questionType.type;
      setValue('questionType', type);
      if(type === QUESTION_RANDOM_ANSWER || type === QUESTION_MATCH_ANSWER) {
        setValue('answer', fullQuizQuestion.results.length>0?fullQuizQuestion.results[0].userAnswer:'');
        clearErrors('answer');
      }
      if(type == QUESTION_MATCH_ANSWER_OPTIONS || type == QUESTION_MULTI_MATCH_ANSWER_OPTIONS) {
        setValue('answerOptions', fullQuizQuestion.answerOptions);
        if(type == QUESTION_MATCH_ANSWER_OPTIONS) {
          setValue('answerSelect', fullQuizQuestion.results.length>0?fullQuizQuestion.results[0].userAnswer:'');
          clearErrors('answerSelect');
        }
        if(type == QUESTION_MULTI_MATCH_ANSWER_OPTIONS) {
          setValue('answerArray', fullQuizQuestion.results.length>0?fullQuizQuestion.results[0].userAnswer:[]);
          clearErrors('answerArray');
        }
      }

    }
  }, [fullQuizQuestion]);

  useEffect(() => {
    dispatch(errorEditCurrentQuestionAC(false));
    if(editCurrentQuestion) {
      dispatch(editCurrentQuestionAC(null));
      navigate(
        (currentQuestionIndex===fullQuizQuestions.length-1)
        ?`/user/quiz/${routeParams.quizId}/finish/${routeParams.attemptId}`
        :`/user/quiz-questions/${routeParams.quizId}/${fullQuizQuestions[currentQuestionIndex+1]?._id}/${routeParams.attemptId}`
      );
    }
  }, [editCurrentQuestion]);

  return (<CenterContent>
    <Grid container sx={{alignSelf: 'start'}}>
      <Grid item xs={12}>
        {loadFullQuiz?<Box>{'Loading...'}</Box>:<Paper className="QuestionsMenu" ref={mainRef} sx={{pt:3, pb: 3, mt: 1, mb: 1, overflowX: 'auto', overflowY: 'hidden'}}>
          <Stepper  nonLinear={true}
                    sx={{}}
                    connector={<Box className="Stepper-connector" sx={{
                      border: '1px solid rgb(0 0 0 / 38%)',
                      borderRadius: 1,
                      position: 'absolute',
                      zIndex: '0',
                      top: '50%',
                      left: 'calc(-50% + 1.5em)',
                      right: 'calc(50% + 1.6em)',
                    }} />}
                    activeStep={currentQuestionIndex}
                    alternativeLabel>
            {fullQuizQuestions.map((entry: any) => {
              return (<Step key={entry._id}
                            ref={entry._id === routeParams.questionId?activeElRef:null}
                            sx={{zIndex: '1', minWidth: '75px'}}
                            disabled={loadEditCurrentQuestion?true:false}
                            completed={entry.results.length >= 1}>
                <StepButton color="inherit"
                            sx={{'&:hover': {textDecoration: 'none'}, '&:hover .StepLabel-box-icon': {backgroundColor: 'warning.main'}}}
                            component={NavLink}
                            to={`/user/quiz-questions/${routeParams.quizId}/${entry._id}/${routeParams.attemptId}`}>
                  <StepLabel StepIconComponent={(o: any) => {
                    return <Box className="StepLabel-box-icon" sx={{
                      '&&&': {backgroundColor: o.active?'primary.main':undefined},
                      backgroundColor: o.active?'primary.main':'rgb(0 0 0 / 38%)',
                      ...(o.completed?{backgroundColor: 'secondary.main'}:{}),
                      color: 'primary.contrastText',
                      p: 1,
                      fontWeight: 'bold',
                      borderRadius: 5,
                      display: 'flex'
                    }}>
                      {o.completed?<CheckIcon sx={{width: 16, height: 16, fontWeight: 'bold'}} />:<Box sx={{pr: 0.5}}>{'#'}</Box>}<Box>{o.icon}</Box>
                    </Box>
                  }} />
                </StepButton>
              </Step>);
            })}
            <Step key={'finish'}
                  disabled={loadEditCurrentQuestion?true:false}
                  sx={{'& .Stepper-connector': {right: 'calc(50% + 2.6em)'}, minWidth: '100px'}}>
              <StepButton color="inherit"
                          sx={{'&:hover': {textDecoration: 'none'}, '&:hover .MuiBox-root': {backgroundColor: 'warning.main'}}}
                          component={NavLink}
                          to={`/user/quiz/${routeParams.quizId}/finish/${routeParams.attemptId}`}>
                <StepLabel StepIconComponent={(o: any) => {
                  return <Box sx={{backgroundColor: 'rgb(0 0 0 / 38%)', color: 'primary.contrastText', p: 1, fontWeight: 'bold', borderRadius: 5, pl: 1.5, pr: 1.5}}>
                    {'Finish'}
                  </Box>
                }}>
                </StepLabel>
              </StepButton>
            </Step>
          </Stepper>
        </Paper>}
      </Grid>
      {errorEditCurrentQuestion?<Grid item xs={12} sx={{pb: 1}}>
        <AlertError onCloseAlert={() => dispatch(errorEditCurrentQuestionAC(false))}
                    error={errorEditCurrentQuestion.error}
                    statusCode={errorEditCurrentQuestion.statusCode}
                    message={errorEditCurrentQuestion.message || errorEditCurrentQuestion.reason}
                    defaultAlerttitleMessage={'Server Error Save Answer'}/>
      </Grid>:null}
      <Grid item xs={12}>
        {!loadFullQuiz && fullQuizQuestion?<Paper>
          <Grid container>
            <Grid item xs={12}>
              <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1, columnGap: 2}}>
                <Grid item>
                  <Typography variant="subtitle1">{'Time left:'}</Typography>
                </Grid>
                <Grid item>
                  {fullQuiz.duration === 0?<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                    <AllInclusiveIcon sx={{color: "secondary.main", alignSelf: 'center'}} />
                    <Typography variant="h6" sx={{color: 'secondary.main', fontWeight: 'bold', ml: 1}}>{'Infinity'}</Typography>
                  </Box>:(
                    (dayjs(fullQuiz.attempts[0].dateStart).valueOf()+fullQuiz.duration < Date.now())
                    ?<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                      <TimerOffIcon sx={{color: "error.main", alignSelf: 'center'}} />
                      <Typography variant="h6" sx={{color: 'error.main', fontWeight: 'bold', ml: 1}}>{'time is over!!!'}</Typography>
                    </Box>
                    :<Box sx={{display: 'flex', alignItems: 'baseline'}}>
                      <TimerIcon sx={{color: "warning.main", alignSelf: 'center', mr: 1}} />
                      <MyTimer dateEnd={dayjs(fullQuiz.attempts[0].dateStart).valueOf()+fullQuiz.duration} />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', p: 0.5, alignItems: 'center', justifyContent: 'start', pl: 1}}>
              <Typography variant="h6" sx={{}}>{'Question'}</Typography>
              <Typography variant="h6" sx={{fontWeight: 'bold', ml: 1}}>{'#'}{fullQuizQuestion.order}</Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5, pl: 1, display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1" sx={{}}>{'ID:'}</Typography>
              <Typography variant="body2" sx={{ml: 1, color: 'text.secondary', fontWeight: 'bold'}}>{fullQuizQuestion._id}</Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5, pl: 3}}>
              <Typography variant="subtitle1" sx={{}}>{fullQuizQuestion.question}</Typography>
            </Grid>
            <Grid item xs={12} sx={{p: 0.5, pl: 1}}>
              <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
                {fullQuizQuestion.questionType.type === QUESTION_RANDOM_ANSWER || fullQuizQuestion.questionType.type === QUESTION_MATCH_ANSWER?'Write an answer to a question:':null}
                {fullQuizQuestion.questionType.type === QUESTION_MATCH_ANSWER_OPTIONS || fullQuizQuestion.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS?'Choose an answer to a question:':null}
              </Typography>
              {fullQuizQuestion.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS
                ?<Typography variant="subtitle2" sx={{color: 'text.secondary'}}>{'(There may be more than one correct answer)'}</Typography>
                :null}
            </Grid>
            <Grid item xs={12}>
              <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                      const payload = {
                        quizId: routeParams.quizId,
                        questionId: routeParams.questionId,
                        attemptId: routeParams.attemptId,
                        ...((data.answerArray && data.questionType==QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?{answerArray: data.answerArray}:{}),
                        ...((data.answerSelect && data.questionType==QUESTION_MATCH_ANSWER_OPTIONS)?{answer: data.answerSelect}:{}),
                        ...((data.answer && (data.questionType==QUESTION_MATCH_ANSWER || data.questionType==QUESTION_RANDOM_ANSWER))?{answer: data.answer}:{}),
                      };
                      console.log(data);
                      console.log(payload);

                      dispatch(sagaUserSetQuestion(payload));
                    })}>
                <Grid container>
                  <Grid item>
                    <Controller control={control}
                                name="questionType"
                                defaultValue={fullQuizQuestion.questionType.type}
                                render={({field}) => (<FormControl></FormControl>)} />
                  </Grid>
                  {(fullQuizQuestion.questionType.type === QUESTION_RANDOM_ANSWER || fullQuizQuestion.questionType.type === QUESTION_MATCH_ANSWER)
                    ?<Grid item xs={12} sx={{p: 1}}>
                      <Controller control={control}
                                  name="answer"
                                  defaultValue={''}
                                  render={({field, fieldState: {error}}) => (
                                    <FormControl variant="outlined" fullWidth={true} sx={{width: '100%'}} disabled={loadEditCurrentQuestion?true:false}>
                                      <InputLabel htmlFor="adornment-answer"
                                                  sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                                  error={!!errors.answer || !!errors.questionType}>
                                        <Box sx={{display: 'flex'}}>
                                          <QuestionAnswerIcon sx={{display: iconAnswerDisabled?'none':'inline'}} />
                                          <Typography sx={{pl: 1}}>{'Answer'}</Typography>
                                        </Box>
                                      </InputLabel>
                                      <OutlinedInput
                                        {...field}
                                        id="adornment-answer"
                                        autoComplete="off"
                                        error={!!errors.answer || !!errors.questionType}
                                        onFocus={(e) => {setIconAnswerDisabled(true)}}
                                        onBlur={(e) => {setIconAnswerDisabled(e.target.value.length>0?true:false);}}
                                        aria-describedby="answer-helper-text"
                                      />
                                      <FormHelperText id="answer-helper-text"
                                                      sx={{pt: 1, pb: 0.5}}
                                                      error={!!errors.answer || !!errors.questionType}>
                                        <Typography sx={{fontWeight: 'bold'}}>{errors.answer?.message as any}</Typography>
                                        <Typography sx={{fontWeight: 'bold'}}>{errors.questionType?.message as any}</Typography>
                                      </FormHelperText>
                                    </FormControl>
                                  )}/>
                    </Grid>
                    :null}
                  {(fullQuizQuestion.questionType.type === QUESTION_MATCH_ANSWER_OPTIONS || fullQuizQuestion.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS)
                    ?<Grid item>
                      <Controller control={control}
                                  name="answerOptions"
                                  defaultValue={fullQuizQuestion.answerOptions}
                                  render={() => (<FormControl></FormControl>)} />
                    </Grid>
                    :null}
                  {fullQuizQuestion.questionType.type === QUESTION_MATCH_ANSWER_OPTIONS
                    ?<Grid item xs={12} sx={{p: 1}}>
                      <Controller control={control}
                                  name="answerSelect"
                                  defaultValue={''}
                                  render={({field, fieldState: {error}}) => (<FormControl sx={{width: '100%'}} disabled={loadEditCurrentQuestion?true:false}>
                                    <RadioGroup {...field}
                                                sx={{p: 0, width: 'inherit'}}
                                                aria-describedby="answer-select-helper-text"
                                    >
                                      {fullQuizQuestion.answerOptions.map((item: any) => {
                                        return (<FormControlLabel key={item} value={item} control={
                                          <Radio sx={{'& .MuiSvgIcon-root': {fontSize: 32} }} />
                                        } label={item}
                                          sx={{
                                            mt: 0.5, mb: 0.5, ml: 0, mr: 0,
                                            width: '100%',
                                            '&:hover': {backgroundColor: 'rgb(0 0 0 / 15%)', borderRadius: 1}
                                          }}/>);
                                      })}
                                    </RadioGroup>
                                    <FormHelperText id="answer-select-helper-text"
                                                    sx={{pt: 0.5, pb: 0.5}}
                                                    error={!!errors.answerSelect || !!errors.questionType || !!errors.answerOptions}>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.answerSelect?.message as any}</Typography>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.questionType?.message as any}</Typography>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.answerOptions?.message as any}</Typography>
                                    </FormHelperText>
                                  </FormControl>)} />
                    </Grid>
                    :null}
                  {fullQuizQuestion.questionType.type === QUESTION_MULTI_MATCH_ANSWER_OPTIONS
                    ?<Grid item xs={12} sx={{p: 1}}>
                      <Controller control={control}
                                  name="answerArray"
                                  defaultValue={[]}
                                  render={({field, fieldState: {error}}) => (<FormControl sx={{width: '100%'}} disabled={loadEditCurrentQuestion?true:false}>
                                    <FormGroup  sx={{p: 0, width: 'inherit'}}
                                                aria-describedby="answer-array-helper-text">
                                      {fullQuizQuestion.answerOptions.map((item: any) => {
                                        return (<FormControlLabel key={item}
                                          control={<Checkbox onChange={(e: any, checked: any) => {
                                            const newValueArray = checked?[...field.value, item]:[...field.value.filter((entry: any) => entry!=item)];
                                            field.onChange.call(null, newValueArray);
                                          }}
                                          checked={field.value.includes(item)} />}
                                          label={item}
                                          sx={{
                                            '& .MuiSvgIcon-root': {fontSize: 32}, mt: 0.5, mb: 0.5, ml: 0, mr: 0,
                                            width: '100%',
                                            '&:hover': {backgroundColor: 'rgb(0 0 0 / 15%)', borderRadius: 1}
                                          }}
                                        />);
                                      })}
                                    </FormGroup>
                                    <FormHelperText id="answer-array-helper-text"
                                                    sx={{pt: 0.5, pb: 0.5}}
                                                    error={!!errors.answerArray || !!errors.questionType || !!errors.answerOptions}>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.answerArray?.message as any}</Typography>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.questionType?.message as any}</Typography>
                                      <Typography sx={{fontWeight: 'bold'}}>{errors.answerOptions?.message as any}</Typography>
                                    </FormHelperText>
                                  </FormControl>)} />
                    </Grid>
                    :null}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>:<Box>{'Loading...'}</Box>}
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{mt: 1, mb: 1, pt: 2, pb: 2}}>
        <Grid container sx={{columnGap: 2, justifyContent: 'center'}}>
          <Grid item>
            <Button variant="contained" color="primary" size="large"
                                       disabled={loadFullQuiz
                                         || currentQuestionIndex === 0}
                                       component={NavLink} to={`/user/quiz-questions/${routeParams.quizId}/${fullQuizQuestions[currentQuestionIndex-1]?._id}/${routeParams.attemptId}`}
                                       startIcon={<SkipPreviousIcon color="inherit" sx={{width: '24px', height: '24px'}} />}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Prev'}
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" size="large"
                                       disabled={loadFullQuiz}
                                       component={NavLink} to={
                                         (currentQuestionIndex===fullQuizQuestions.length-1)
                                         ?`/user/quiz/${routeParams.quizId}/finish/${routeParams.attemptId}`
                                         :`/user/quiz-questions/${routeParams.quizId}/${fullQuizQuestions[currentQuestionIndex+1]?._id}/${routeParams.attemptId}`
                                       }
                                       endIcon={<SkipNextIcon color="inherit" sx={{width: '24px', height: '24px'}} />}>
              <Typography sx={{fontWeight: 'bold'}}>
                {currentQuestionIndex===fullQuizQuestions.length-1?'Finish':'Next'}
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            {!loadEditCurrentQuestion?<Button variant="contained" color="success" size="large"
                                       sx={{minWidth: '150px'}}
                                       disabled={loadFullQuiz}
                                       endIcon={<SaveAsIcon color="inherit" sx={{width: '24px', height: '24px'}} />}
                                       onClick={() => {
                                         dispatch(errorEditCurrentQuestionAC(false));
                                         formRef.current.requestSubmit();
                                       }}>
              <Typography sx={{fontWeight: 'bold'}}>
                {(currentQuestionIndex===fullQuizQuestions.length-1)?'Save & Finish':'Save & Next'}
              </Typography>
            </Button>:<LoadingButton loading={true}
                                     sx={{minWidth: '150px'}}
                                     loadingPosition="end"
                                     variant="outlined">
              <Typography sx={{fontWeight: 'bold'}}>
                {'Saving...'}
              </Typography>
            </LoadingButton>}
          </Grid>
        </Grid>
        </Paper>
      </Grid>
    </Grid>
  </CenterContent>);
}
