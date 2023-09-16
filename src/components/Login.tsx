import React, {useState, useRef, useEffect} from 'react';
import {Grid, Box, Paper, Typography, Alert, AlertTitle, Button,
        InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel,
        IconButton} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {NavLink, useMatches, useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useSelector, useDispatch} from 'react-redux';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {AlertError} from './AlertError';
import {CenterContent} from './CenterContent';

import {errorLogin} from '../redux/auth';
import {sagaLogin} from '../redux/sagas/auth';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required')
		                    .min(5, 'Username must be at least 5 characters')
		                    .max(255, 'Username must not exceed 255 characters'),
	password: Yup.string().required('Password is required')
		                    .min(6, 'Password must be at least 6 characters')
		                    .max(255, 'Password must not exceed 255 characters')
});

export interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit, setValue, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const error = useSelector((state: any) => state.auth.errorLogin);
	const login = useSelector((state: any) => state.auth.login);
  const loadLogin = useSelector((state: any) => state.auth.loadLogin);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [iconUsernameDisabled, setIconUsernameDisabled] = useState<boolean>(false);
  const [iconPasswordDisabled, setIconPasswordDisabled] = useState<boolean>(false);

  const handleClickShowPassword: React.MouseEventHandler<HTMLElement> = () => setShowPassword((show) => !show);

  const handleMouseDownPassword: React.MouseEventHandler<HTMLElement> = (e) => {e.preventDefault();};

  const formRef = useRef<any>(null);

  useEffect(() => {
		if(login) {
			navigate('/user/quizs');
      //navigate('/admin/quizs');
		}
	}, [login]);

  useEffect(() => () => {dispatch(errorLogin(false))}, [login]);

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

  return (<CenterContent><Box sx={{maxWidth: '450px', p: 2}}>
    <Grid container>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant="h4">Authorization</Typography>
      </Grid>
      <Grid item xs={12} sx={{pt: 1, pb: 1}}>
        <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                console.log(data);
                dispatch(sagaLogin(data));
              })}>
          <Grid container>
            {error?<Grid item xs={12} sx={{pt: 1, pb: 1}}>
              <AlertError onCloseAlert={() => dispatch(errorLogin(false))}
                          error={error.error}
                          statusCode={error.statusCode}
                          message={error.message || error.reason}
                          defaultAlerttitleMessage={'Server Error Authorization'}/>
            </Grid>:null}
            <Grid item xs={12} sx={{pt: 1}}>
              <Controller control={control}
                          name="username"
                          render={({field, fieldState: {error}}) => (
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadLogin?true:false}>
                              <InputLabel htmlFor="adornment-username"
                                          sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                          error={!!errors.username}>
                                <Box sx={{display: 'flex'}}>
                                  <PersonIcon sx={{display: iconUsernameDisabled?'none':'inline'}} />
                                  <Typography sx={{pl: 1}}>{'Username'}</Typography>
                                </Box>
                              </InputLabel>
                              <OutlinedInput
                                {...field}
                                id="adornment-username"
                                autoComplete="off"
                                error={!!errors.username}
                                onFocus={(e) => {setIconUsernameDisabled(true)}}
                                onBlur={(e) => {setIconUsernameDisabled(e.target.value.length>0?true:false);}}
                                aria-describedby="username-helper-text"
                              />
                              <FormHelperText id="username-helper-text" error={!!errors.username}>
                                <Typography sx={{fontWeight: 'bold'}}>{errors.username?.message as any}</Typography>
                              </FormHelperText>
                            </FormControl>
                          )}/>
            </Grid>
            <Grid item xs={12} sx={{pt: 1}}>
              <Controller control={control}
                          name="password"
                          render={({field, fieldState: {error}}) => (
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadLogin?true:false}>
                              <InputLabel htmlFor="adornment-password"
                                          sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                          error={!!errors.password}>
                                <Box sx={{display: 'flex'}}>
                                  <LockIcon sx={{display: iconPasswordDisabled?'none':'inline'}} />
                                  <Typography sx={{pl: 1}}>{'Password'}</Typography>
                                </Box>
                              </InputLabel>
                              <OutlinedInput
                                {...field}
                                id="adornment-password"
                                autoComplete="off"
                                type={showPassword?'text':'password'}
                                error={!!errors.password}
                                onFocus={(e) => {setIconPasswordDisabled(true)}}
                                onBlur={(e) => {setIconPasswordDisabled(e.target.value.length>0?true:false);}}
                                aria-describedby="password-helper-text"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                color={!!errors.password?'error':'inherit'}
                                                edge="end">
                                      {showPassword?<VisibilityOffIcon />:<VisibilityIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              <FormHelperText id="password-helper-text" error={!!errors.password}>
                                <Typography sx={{fontWeight: 'bold'}}>{errors.password?.message as any}</Typography>
                              </FormHelperText>
                            </FormControl>
                          )}/>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
            <Button component={NavLink} to='/registration'
                    variant="outlined"
                    color="info"
                    disabled={loadLogin?true:false}
                    startIcon={<AppRegistrationIcon color="inherit" sx={{width: 24, height: 24}} />}>
              <Box><Typography>{'Sign up'}</Typography></Box>
            </Button>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
            <Button variant="outlined" color="secondary" size="large" sx={{minWidth: '135px'}}
                    startIcon={<ClearAllIcon color="inherit" sx={{width: 24, height: 24}} />}
                    onClick={() => {
                      reset({
                        username: '',
                        password: ''
                      });
                      dispatch(errorLogin(false));
                    }} disabled={loadLogin?true:false}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Reset'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
            {!loadLogin?<Button variant="contained" color="success" size="large" sx={{minWidth: '135px'}}
                                startIcon={<LoginIcon color="inherit" sx={{width: 24, height: 24}} />}
                                disabled={loadLogin?true:false}
                                onClick={() => {
                                  dispatch(errorLogin(false));
                                  formRef.current.requestSubmit();
                                }}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Sign in'}
              </Typography>
            </Button>:<LoadingButton loading={true}
                                     sx={{minWidth: '135px'}}
                                     loadingPosition="start"
                                     startIcon={<SaveIcon />}
                                     variant="outlined">
              <Typography sx={{fontWeight: 'bold'}}>
                {'Logining...'}
              </Typography>
            </LoadingButton>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box></CenterContent>);
}
