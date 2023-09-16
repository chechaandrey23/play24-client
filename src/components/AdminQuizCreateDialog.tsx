import * as React from 'react';
import {useRef, useEffect, useCallback, useState} from 'react';
import {Container, Box, Typography, Grid, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip} from '@mui/material';
import {InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Checkbox, FormControlLabel} from '@mui/material';

import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {TimeField} from '@mui/x-date-pickers/TimeField';

import SaveIcon from '@mui/icons-material/Save';
import QuizIcon from '@mui/icons-material/Quiz';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import PublicIcon from '@mui/icons-material/Public';

import {AlertError} from './AlertError';

import {errorCreateQuiz as errorCreateQuizAC, createQuiz as createQuizAC} from '../redux/admin.quizs';
import {sagaAdminCreateQuiz} from '../redux/sagas/admin.quizs';

const validationSchema = Yup.object().shape({
  quizname: Yup.string().required('Quizname is required')
		                    .min(5, 'Quizname must be at least 5 characters')
		                    .max(255, 'Quizname must not exceed 255 characters'),
  public: Yup.boolean().required('Public is required'),
  description: Yup.string().required('Description is required')
		                      .min(1, 'Description must be at least 1 characters')
		                      .max(255, 'Description must not exceed 255 characters'),
  duration: Yup.number().required('Duration is required')
                        .integer('Duration must be an integer')
                        .min(0, 'The value of Duration must be greater than or equal to 0')
                        .max(Number.MAX_SAFE_INTEGER, `The Duration value must be less than or equal to ${Number.MAX_SAFE_INTEGER}.`),
  numberOfAttempts: Yup.number().required('NumberOfAttempts is required')
                                .integer('NumberOfAttempts must be an integer')
                                .min(0, 'The value of NumberOfAttempts must be greater than or equal to 0')
                                .max(Number.MAX_SAFE_INTEGER, `The NumberOfAttempts value must be less than or equal to ${Number.MAX_SAFE_INTEGER}.`),
});

export interface AdminQuizCreateDialogProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export const AdminQuizCreateDialog: React.FC<AdminQuizCreateDialogProps> = (props) => {
  const dispatch = useDispatch();

  const {register, handleSubmit, setValue, setError, clearErrors, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);

  const errorCreateQuiz = useSelector((state: any) => state.adminQuizs.errorCreateQuiz);
	const createQuiz = useSelector((state: any) => state.adminQuizs.createQuiz);
  const loadCreateQuiz = useSelector((state: any) => state.adminQuizs.loadCreateQuiz);

  const [iconQuiznameDisabled, setIconQuiznameDisabled] = useState<boolean>(false);
  const [iconQuizDescriptionDisabled, setIconQuizDescriptionDisabled] = useState<boolean>(false);
  const [iconQuizDurationDisabled, setIconQuizDurationDisabled] = useState<boolean>(false);
  const [iconQuizNumberOfAttemptsDisabled, setIconQuizNumberOfAttemptsDisabled] = useState<boolean>(false);

  const handleOKClose = useCallback(() => {
    formRef.current.requestSubmit();
	}, []);

	useEffect(() => {
    if(createQuiz) {
      dispatch(createQuizAC(null));
      props.onSuccess?.call(null);
    }
	}, [createQuiz]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        formRef.current.requestSubmit();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    dispatch(errorCreateQuizAC(false));
  }, []);

  return (<Dialog open={true}
                  fullScreen={false}
                  scroll={'body'}
                  fullWidth={true}
                  onClose={!loadCreateQuiz?props.onClose:undefined}
                  maxWidth={'sm'}>
    <DialogTitle>
      <Typography variant="h6">
        {'Dialog Create Quiz'}
      </Typography>
      <Tooltip title={'Close Dialog'} arrow={true}>
        <IconButton aria-label="close"
                    color="secondary"
                    size="large"
                    disabled={loadCreateQuiz}
                    onClick={props.onClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8
                    }}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </DialogTitle>
    <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 0}}>
      <Grid container>
        {errorCreateQuiz?<Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
          <AlertError onCloseAlert={() => dispatch(errorCreateQuizAC(false))}
                      error={errorCreateQuiz.error}
                      statusCode={errorCreateQuiz.statusCode}
                      message={errorCreateQuiz.message || errorCreateQuiz.reason}
                      defaultAlerttitleMessage={'Server Error Create Quiz'}/>
        </Grid>:null}
        <Grid item xs={12} sx={{pt: 1, pb: 1, pl: 2, pr: 2}}>
          <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                  console.log(data);
                  dispatch(sagaAdminCreateQuiz({
                    ...data,
                    //quizname: data.quizname,
                    draft: !data.public,
                  }));
                })}>
            <Grid container>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="quizname"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuiz?true:false}>
                                <InputLabel htmlFor="adornment-quizname"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.quizname}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuizIcon sx={{display: iconQuiznameDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Quizname'}</Typography>
                                  </Box>
                                </InputLabel>
                                <OutlinedInput
                                  {...field}
                                  id="adornment-quizname"
                                  autoComplete="off"
                                  error={!!errors.quizname}
                                  onFocus={(e) => {setIconQuiznameDisabled(true)}}
                                  onBlur={(e) => {setIconQuiznameDisabled(e.target.value.length>0?true:false);}}
                                  multiline={true}
                                  aria-describedby="quizname-helper-text"
                                />
                                <FormHelperText id="quizname-helper-text" error={!!errors.quizname}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.quizname?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="description"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuiz?true:false}>
                                <InputLabel htmlFor="adornment-quiz-description"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.description}>
                                  <Box sx={{display: 'flex'}}>
                                    <DescriptionIcon sx={{display: iconQuizDescriptionDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Quiz description'}</Typography>
                                  </Box>
                                </InputLabel>
                                <OutlinedInput
                                  {...field}
                                  id="adornment-quiz-description"
                                  autoComplete="off"
                                  error={!!errors.description}
                                  onFocus={(e) => {setIconQuizDescriptionDisabled(true)}}
                                  onBlur={(e) => {setIconQuizDescriptionDisabled(e.target.value.length>0?true:false);}}
                                  multiline={true}
                                  aria-describedby="quiz-description-helper-text"
                                />
                                <FormHelperText id="quiz-description-helper-text" error={!!errors.description}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.description?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="duration"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuiz?true:false}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker ampm={false}
                                              value={(field.value !== null && field.value !== undefined)?getDuration(field.value):field.value}
                                              disabled={loadCreateQuiz?true:false}
                                              label={<Box sx={{display: 'flex', pl: 1}}>
                                                <TimelapseIcon sx={{display: iconQuizDurationDisabled?'none':'inline'}} />
                                                <Typography sx={{pl: 1}}>{'Quiz duration'}</Typography>
                                              </Box>}
                                              timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
                                              onChange={(o: any) => {
                                                field.onChange.call(null, (o!==null && o!== undefined)?equalDuration(o):o);
                                              }}
                                              onError={(message: any) => {
                                                if(message) {
                                                  setError('duration', {type: 'custom', message: message});
                                                } else {
                                                  clearErrors('duration');
                                                }
                                              }}
                                              views={['hours', 'minutes', 'seconds']}
                                              slotProps={{
                                                textField: {
                                                  error: !!errors.duration,
                                                  onFocus: (e: any) => {setIconQuizDurationDisabled(true)},
                                                  onBlur: (e: any) => {setIconQuizDurationDisabled((field.value===null || field.value===undefined)?false:true);},
                                                }
                                              }}
                                              aria-describedby="quiz-duration-helper-text"/>
                                  <FormHelperText id="quiz-duration-helper-text" error={!!errors.duration}>
                                    <Typography sx={{fontWeight: 'bold'}}>{errors.duration?.message as any}</Typography>
                                  </FormHelperText>
                                </LocalizationProvider>
                              </FormControl>
                            )}/>
              </Grid>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="numberOfAttempts"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuiz?true:false}>
                                <InputLabel htmlFor="adornment-quiz-number-of-attempts"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.numberOfAttempts}>
                                  <Box sx={{display: 'flex'}}>
                                    <PublicIcon sx={{display: iconQuizNumberOfAttemptsDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Number of attempts to pass the quiz'}</Typography>
                                  </Box>
                                </InputLabel>
                                <OutlinedInput
                                  {...field}
                                  id="adornment-quiz-number-of-attempts"
                                  autoComplete="off"
                                  error={!!errors.numberOfAttempts}
                                  onFocus={(e) => {setIconQuizNumberOfAttemptsDisabled(true)}}
                                  onBlur={(e) => {setIconQuizNumberOfAttemptsDisabled(e.target.value.length>0?true:false);}}
                                  multiline={true}
                                  aria-describedby="quiz-number-of-attempts-helper-text"
                                />
                                <FormHelperText id="quiz-number-of-attempts-helper-text" error={!!errors.numberOfAttempts}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.numberOfAttempts?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="public"
                            defaultValue={true}
                            render={({field, fieldState: {error}}) => (
                              <FormControlLabel control={
                                <Checkbox {...field}
                                          disabled={loadCreateQuiz?true:false}
                                          checked={field.value}
                                          sx={{}} />
                              } label={<Box>
                                <Typography sx={{ml: 1}}>
                                  {'Post a quiz'}
                                </Typography>
                              </Box>} />
                            )}/>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions sx={{display: 'flex', justifyContent: 'center', pb: 3}}>
      <Button variant="outlined" color="secondary" size="large"
              startIcon={<ReplyIcon color="inherit" sx={{width: 32, height: 32}} />}
              onClick={props.onClose} disabled={loadCreateQuiz}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Close'}
        </Typography>
      </Button>
      {!loadCreateQuiz?<Button variant="contained" color="success" size="large"
                           startIcon={<SaveAsIcon color="inherit" sx={{width: 32, height: 32}} />}
                           onClick={handleOKClose}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Create'}
        </Typography>
      </Button>:<LoadingButton loading
                               size="large"
                               loadingPosition="start"
                               startIcon={<SaveIcon color="inherit" sx={{width: 32, height: 32}} />}
                               variant="outlined">
        <Typography sx={{fontWeight: 'bold'}}>
          {'Creating...'}
        </Typography>
      </LoadingButton>}
    </DialogActions>
  </Dialog>);
}

function getDuration(duration: number) {
  const d = dayjs().hour(0).minute(0).second(0).millisecond(0);
  return dayjs(d.valueOf() + duration)
}

function equalDuration(o: any) {
  let duration = 0;
  duration += o.millisecond();
  duration += o.second() * 1000;
  duration += o.minute() * 60 * 1000;
  duration += o.hour() * 60 * 60 * 1000;
  return duration;
}
