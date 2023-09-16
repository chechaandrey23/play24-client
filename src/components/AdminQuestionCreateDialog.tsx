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
import {FormControlLabel} from '@mui/material';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {MenuItem, ListItemText, Checkbox, Chip, CircularProgress} from '@mui/material';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';

import SaveIcon from '@mui/icons-material/Save';
import QuizIcon from '@mui/icons-material/Quiz';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TuneIcon from '@mui/icons-material/Tune';

import {AlertError} from './AlertError';

import {errorCreateQuestion as errorCreateQuestionAC, createQuestion as createQuestionAC} from '../redux/admin.questions';
import {sagaAdminCreateQuestion, sagaAdminQuestionTypes} from '../redux/sagas/admin.questions';

import {QUESTION_RANDOM_ANSWER, QUESTION_MATCH_ANSWER,
        QUESTION_MATCH_ANSWER_OPTIONS, QUESTION_MULTI_MATCH_ANSWER_OPTIONS} from '../config';

const validationSchema = Yup.object().shape({
  question: Yup.string().required('Question is required')
		                    .min(5, 'Question must be at least 5 characters')
		                    .max(255, 'Question must not exceed 255 characters'),
  questionType: Yup.object().shape({
    id: Yup.string().required('QuestionType id is required')
                    .length(24, 'QuestionType id must be from 24 characters!!!'),
    type: Yup.number().required('QuestionType type is required')
                      .oneOf([QUESTION_RANDOM_ANSWER,
                              QUESTION_MATCH_ANSWER,
                              QUESTION_MATCH_ANSWER_OPTIONS,
                              QUESTION_MULTI_MATCH_ANSWER_OPTIONS], 'QuestionType type is incorrect!!!'),
  }),
  public: Yup.boolean().required('Public is required'),
  answer: Yup.string().when('questionType.type', {
    is: (value: any) => (value == QUESTION_MATCH_ANSWER),
    then: (schema) => schema.required('Answer id is required')
                            .min(1, 'Answer must be at least 1 characters')
                            .max(255, 'Answer must not exceed 255 characters'),
  }),
  answerSelect: Yup.string().when('questionType.type', {
    is: (value: any) => (value == QUESTION_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer id is required')
                            .min(1, 'Answer must be at least 1 characters')
                            .max(255, 'Answer must not exceed 255 characters')
                            .test('answerInOptions',
                                  'The answer should be in the answer options',
                                  (value, ctx) => {
                                    const o = ctx.parent.answerOptions.map((entry: any) => entry.value);
                                    return o.includes(value);
                                  })
  }),
  answerArray: Yup.array().when('questionType.type', {
    is: (value: any) => (value == QUESTION_MULTI_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer Array id is required')
                            .min(1, 'At least one Answer Array must be selected')
                            .max(20, 'You cannot select more than 20 elements')
                            .test('answerArrayInOptions',
                                  'The Answer Array should be in the answer options',
                                  (value, ctx) => {
                                    const o = ctx.parent.answerOptions.map((entry: any) => entry.value);
                                    return value.filter((item) => o.includes(item)).length == value.length;
                                  })
  }),
  answerOptions: Yup.array().when('questionType.type', {
    is: (value: any) => (value == QUESTION_MATCH_ANSWER_OPTIONS || value == QUESTION_MULTI_MATCH_ANSWER_OPTIONS),
    then: (schema) => schema.required('Answer Options is required')
                            .min(1, 'At least one Answer Options must be selected')
                            .max(20, 'You cannot select more than 20 options')
                            .of(
                              Yup.object().shape({
                                value: Yup.string().required('Answer Option is required')
                                                  .min(1, 'Answer Option must be at least 1 characters')
                                                  .max(255, 'Answer Option must not exceed 255 characters')
                              })
                            )
  }),
});

// 1
// void
// 2
// + field answer -> text field (1)
// 3
// + field answerOptions -> autocomplete (2)
// + field answer -> select field (3)
// 4
// + field answerOptions -> authocomplete (2)
// + field answerArray -> multi-select field (3-4)

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface AnswerOptionsInterface {
  label: string;
  value: string;
  create?: boolean;
}

const filter = createFilterOptions<AnswerOptionsInterface>();

export interface AdminQuestionCreateDialogProps {
  onSuccess?: () => void;
  onClose: () => void;
  quizId: string|undefined;
}

export const AdminQuestionCreateDialog: React.FC<AdminQuestionCreateDialogProps> = (props) => {
  const dispatch = useDispatch();

  const {register, handleSubmit, setValue, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);

  const errorCreateQuestion = useSelector((state: any) => state.adminQuestions.errorCreateQuestion);
	const createQuestion = useSelector((state: any) => state.adminQuestions.createQuestion);
  const loadCreateQuestion = useSelector((state: any) => state.adminQuestions.loadCreateQuestion);

  const errorQuestionTypes = useSelector((state: any) => state.adminQuestions.errorQuestionTypes);
	const questionTypes = useSelector((state: any) => state.adminQuestions.questionTypes);
  const loadQuestionTypes = useSelector((state: any) => state.adminQuestions.loadQuestionTypes);

  const [iconQuestionDisabled, setIconQuestionDisabled] = useState<boolean>(false);
  const [iconQuestionTypeDisabled, setIconQuestionTypeDisabled] = useState<boolean>(false);
  const [iconAnswerDisabled, setIconAnswerDisabled] = useState<boolean>(false);
  const [iconAnswerOptionsDisabled, setIconAnswerOptionsDisabled] = useState<boolean>(false);
  const [iconAnswerSelectDisabled, setIconAnswerSelectDisabled] = useState<boolean>(false);
  const [iconAnswerArrayDisabled, setIconAnswerArrayDisabled] = useState<boolean>(false);

  const [typeQuestion, setTypeQuestion] = useState<number|null>(null);

  const handleOKClose = useCallback(() => {
    formRef.current.requestSubmit();
	}, []);

	useEffect(() => {
    if(createQuestion) {
      dispatch(createQuestionAC(null));
      props.onSuccess?.call(null);
    }
	}, [createQuestion]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        //formRef.current.requestSubmit();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    dispatch(sagaAdminQuestionTypes());
  }, []);

  useEffect(() => {
    dispatch(errorCreateQuestionAC(false));
  }, []);

  const [answerOptions, setAnswerOptions] = useState<Array<AnswerOptionsInterface>>([]);
  const [answerOptionsSelected, setAnswerOptionsSelected] = useState<Array<string>>([]);

  return (<Dialog open={true}
                  fullScreen={false}
                  scroll={'body'}
                  fullWidth={true}
                  onClose={!loadCreateQuestion?props.onClose:undefined}
                  maxWidth={'sm'}>
    <DialogTitle>
      <Typography variant="h6">
        {'Dialog Create Question'}
      </Typography>
      <Tooltip title={'Close Dialog'} arrow={true}>
        <IconButton aria-label="close"
                    color="secondary"
                    size="large"
                    disabled={loadCreateQuestion}
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
        {errorCreateQuestion?<Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
          <AlertError onCloseAlert={() => dispatch(errorCreateQuestionAC(false))}
                      error={errorCreateQuestion.error}
                      statusCode={errorCreateQuestion.statusCode}
                      message={errorCreateQuestion.message || errorCreateQuestion.reason}
                      defaultAlerttitleMessage={'Server Error Create Question'}/>
        </Grid>:null}
        <Grid item xs={12} sx={{pt: 1, pb: 1, pl: 2, pr: 2}}>
          <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                  const payload = {
                    question: data.question,
                    questionTypeId: data.questionType.id,
                    quizId: props.quizId,
                    ...((data.answerArray && data.questionType.type==QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?{answerArray: data.answerArray}:{}),
                    ...((data.answerSelect && data.questionType.type==QUESTION_MATCH_ANSWER_OPTIONS)?{answer: data.answerSelect}:{}),
                    ...((data.answer && data.questionType.type==QUESTION_MATCH_ANSWER)?{answer: data.answer}:{}),
                    ...((data.answerOptions && (data.questionType.type==QUESTION_MATCH_ANSWER_OPTIONS || data.questionType.type==QUESTION_MULTI_MATCH_ANSWER_OPTIONS))?{answerOptions: data.answerOptions.map((entry: any) => entry.value)}:{}),
                    draft: !data.public,
                  };
                  console.log(data);
                  console.log(payload);

                  dispatch(sagaAdminCreateQuestion(payload));
                })}>
            <Grid container>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="question"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <InputLabel htmlFor="adornment-question"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.question}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuizIcon sx={{display: iconQuestionDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Question'}</Typography>
                                  </Box>
                                </InputLabel>
                                <OutlinedInput
                                  {...field}
                                  id="adornment-question"
                                  autoComplete="off"
                                  error={!!errors.question}
                                  onFocus={(e) => {setIconQuestionDisabled(true)}}
                                  onBlur={(e) => {setIconQuestionDisabled(e.target.value.length>0?true:false);}}
                                  multiline={true}
                                  aria-describedby="question-helper-text"
                                />
                                <FormHelperText id="question-helper-text" error={!!errors.question}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.question?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="questionType"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <InputLabel htmlFor="adornment-question-type"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.questionType}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuestionMarkIcon sx={{display: iconQuestionTypeDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{loadQuestionTypes?'Loading question types ...':'Selected question type'}</Typography>
                                  </Box>
                                </InputLabel>
                                <Select {...field}
                                        id="adornment-question-type"
                                        multiple={false}
                                        value={field.value}
                                        onChange={(...args) => {
                                          setTypeQuestion(args[0].target.value.type);
                                          field.onChange.call(null, ...args);
                                        }}
                                        input={<OutlinedInput label="Selected question type" />}
                                        renderValue={(selected) => {
                                          return (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {questionTypes.filter((entry: any) => entry._id == selected.id).map((entry: any) => (
                                              /*<Chip key={entry._id} label={entry.title} />*/
                                              <Typography>{entry.title}</Typography>
                                            ))}
                                          </Box>);
                                        }}
                                        error={!!errors.questionType}
                                        aria-describedby="question-type-helper-text"
                                        endAdornment={
                                          loadQuestionTypes?<InputAdornment position="start" sx={{pl: '1em', pr: '1em', color: 'gray'}}>
                                            <CircularProgress color="inherit" size='2em' />
                                          </InputAdornment>:null
                                        }
                                        onFocus={(e) => {setIconQuestionTypeDisabled(true)}}
                                        onBlur={(e) => {setIconQuestionTypeDisabled(e.target.value?true:false);}}
                                        MenuProps={menuProps}>
                                  {questionTypes.map((entry: any) => {
                                    return (<MenuItem key={entry.type} value={{id: entry._id, type: entry.type} as any}>
                                      <Checkbox checked={field.value?.id == entry._id} />
                                      <ListItemText primary={entry.title} />
                                    </MenuItem>);
                                  })}
                                </Select>
                                <FormHelperText id="question-type-helper-text" error={!!errors.questionType}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.questionType?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>
              {(typeQuestion==QUESTION_MATCH_ANSWER)?<Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="answer"
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <InputLabel htmlFor="adornment-answer"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.answer}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuestionAnswerIcon sx={{display: iconAnswerDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Correct Answer'}</Typography>
                                  </Box>
                                </InputLabel>
                                <OutlinedInput
                                  {...field}
                                  id="adornment-answer"
                                  autoComplete="off"
                                  error={!!errors.answer}
                                  onFocus={(e) => {setIconAnswerDisabled(true)}}
                                  onBlur={(e) => {setIconAnswerDisabled(e.target.value.length>0?true:false);}}
                                  multiline={true}
                                  aria-describedby="answer-helper-text"
                                />
                                <FormHelperText id="answer-helper-text" error={!!errors.answer}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.answer?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>:null}
              {(typeQuestion == QUESTION_MATCH_ANSWER_OPTIONS || typeQuestion == QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?<Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="answerOptions"
                            defaultValue={answerOptionsSelected}
                            render={({field, fieldState: {error}}) => {return(
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <Autocomplete value={field.value}
                                              options={answerOptions}
                                              multiple={true}
                                              onFocus={(e) => {setIconAnswerOptionsDisabled(true)}}
                                              onBlur={(e) => {setIconAnswerOptionsDisabled(field.value.length>0?true:false);}}
                                              noOptionsText={<Box sx={{display: 'flex'}}>
                                                <Typography>{'Pleace Add Answer Options!'}</Typography>
                                              </Box>}
                                              isOptionEqualToValue={(option, value) => {
                                                return option.value == value.value;
                                              }}
                                              onChange={(event, newValue) => {
                                                newValue = newValue.map((item) => {
                                                  if(typeof item === 'string') {
                                                    const entry = {label: item, value: item};
                                                    setAnswerOptions([...answerOptions, entry]);
                                                    return entry;
                                                  } else if(item.create){
                                                    const entry = {label: item.label, value: item.value};
                                                    setAnswerOptions([...answerOptions, entry]);
                                                    return entry;
                                                  } else {
                                                    return item;
                                                  }
                                                });
                                                setAnswerOptionsSelected(newValue);
                                                field.onChange.call(null, newValue);
                                              }}
                                              filterOptions={(options, params) => {
                                                const filtered = filter(options, params);
                                                const {inputValue} = params;
                                                const isExisting = options.some((option) => inputValue == option.value);
                                                if(inputValue !== '' && !isExisting) {
                                                  filtered.push({value: inputValue, label: inputValue, create: true});
                                                }
                                                return filtered;
                                              }}
                                              selectOnFocus={true}
                                              clearOnBlur={true}
                                              handleHomeEndKeys={true}
                                              getOptionLabel={(option) => {
                                                if(typeof option === 'string') return option;
                                                return option.label;
                                              }}
                                              renderOption={(props, option, o) => {
                                                if(option.create) {
                                                  return (<li {...props}>
                                                    <Typography>{`Create: `}</Typography>
                                                    <Typography sx={{fontWeight: 'bold', ml: 1}}>{option.label}</Typography>
                                                  </li>);
                                                } else {
                                                  return (<li {...props}>
                                                    <Checkbox checked={o.selected} />
                                                    <Typography sx={{ml: 1}}>{option.label}</Typography>
                                                  </li>);
                                                }
                                              }}
                                              freeSolo={true}
                                              renderInput={(params) => (
                                                <TextField {...params}  aria-describedby="answer-options-helper-text"
                                                                        label={<Box sx={{display: 'flex'}}>
                                                                          <TuneIcon sx={{display: iconAnswerOptionsDisabled?'none':'inline'}} />
                                                                          <Typography sx={{pl: 1}}>{'Answer Options'}</Typography>
                                                                        </Box>}
                                                                        error={!!errors.answerOptions} />
                                              )}
                                            />
                                <FormHelperText id="answer-options-helper-text" error={!!errors.answerOptions}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.answerOptions?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            );}}/>
              </Grid>:null}
              {(typeQuestion == QUESTION_MATCH_ANSWER_OPTIONS)?<Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="answerSelect"
                            defaultValue={''}
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <InputLabel htmlFor="adornment-answer-select"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.answerSelect}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuestionAnswerIcon sx={{display: iconAnswerSelectDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Selected correct answer'}</Typography>
                                  </Box>
                                </InputLabel>
                                <Select {...field}
                                        id="adornment-answer-select"
                                        multiple={false}
                                        input={<OutlinedInput label="Selected correct answer" />}
                                        renderValue={(selected) => {
                                          return (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {answerOptionsSelected.filter((entry: any) => entry.value == selected).map((entry: any) => (
                                              /*<Chip key={entry._id} label={entry.title} />*/
                                              <Typography>{entry.label}</Typography>
                                            ))}
                                          </Box>);
                                        }}
                                        error={!!errors.answerSelect}
                                        aria-describedby="answer-select-helper-text"
                                        onFocus={(e) => {setIconAnswerSelectDisabled(true)}}
                                        onBlur={(e) => {setIconAnswerSelectDisabled(e.target.value?true:false);}}
                                        MenuProps={menuProps}>
                                  {answerOptionsSelected.map((entry: any, index: number) => {
                                    return (<MenuItem key={entry.value} value={entry.value}>
                                      <Checkbox checked={field.value == entry.value} />
                                      <ListItemText primary={entry.label} />
                                    </MenuItem>);
                                  })}
                                </Select>
                                <FormHelperText id="answer-select-helper-text" error={!!errors.answerSelect}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.answerSelect?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>:null}
              {(typeQuestion == QUESTION_MULTI_MATCH_ANSWER_OPTIONS)?<Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="answerArray"
                            defaultValue={[]}
                            render={({field, fieldState: {error}}) => (
                              <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadCreateQuestion?true:false}>
                                <InputLabel htmlFor="adornment-answer-array"
                                            sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                            error={!!errors.answerArray}>
                                  <Box sx={{display: 'flex'}}>
                                    <QuestionAnswerIcon sx={{display: iconAnswerArrayDisabled?'none':'inline'}} />
                                    <Typography sx={{pl: 1}}>{'Selected correct all answers'}</Typography>
                                  </Box>
                                </InputLabel>
                                <Select {...field}
                                        id="adornment-answer-array"
                                        multiple={true}
                                        value={field.value}
                                        input={<OutlinedInput label="Selected correct all answers" />}
                                        renderValue={(selected) => {
                                          return (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {answerOptionsSelected.filter((entry: any) => selected.indexOf(entry.value) > -1).map((entry: any) => (
                                              <Chip key={entry.value} label={entry.label} />
                                              /*<Typography>{entry.label}</Typography>*/
                                            ))}
                                          </Box>);
                                        }}
                                        error={!!errors.answerArray}
                                        aria-describedby="answer-array-helper-text"
                                        onFocus={(e) => {setIconAnswerArrayDisabled(true)}}
                                        onBlur={(e) => {setIconAnswerArrayDisabled(e.target.value.length?true:false);}}
                                        MenuProps={menuProps}>
                                  {answerOptionsSelected.map((entry: any) => {
                                    return (<MenuItem key={entry.role} value={entry.value}>
                                      <Checkbox checked={(field.value || []).indexOf(entry.value) > -1} />
                                      <ListItemText primary={entry.label} />
                                    </MenuItem>);
                                  })}
                                </Select>
                                <FormHelperText id="answer-array-helper-text" error={!!errors.answerArray}>
                                  <Typography sx={{fontWeight: 'bold'}}>{errors.answerArray?.message as any}</Typography>
                                </FormHelperText>
                              </FormControl>
                            )}/>
              </Grid>:null}
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="public"
                            defaultValue={true}
                            render={({field, fieldState: {error}}) => (
                              <FormControlLabel control={
                                <Checkbox {...field}
                                          disabled={loadCreateQuestion?true:false}
                                          checked={field.value}
                                          sx={{}} />
                              } label={<Box>
                                <Typography sx={{ml: 1}}>
                                  {'Post a question'}
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
              onClick={props.onClose} disabled={loadCreateQuestion}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Close'}
        </Typography>
      </Button>
      {!loadCreateQuestion?<Button variant="contained" color="success" size="large"
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
