import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {Grid, Box, Paper, Typography, Alert, AlertTitle, Button,
        InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel,
        IconButton} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {NavLink, useMatches, useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useSelector, useDispatch} from 'react-redux';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {MenuItem, ListItemText, Checkbox, Chip, CircularProgress} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SaveIcon from '@mui/icons-material/Save';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import {AlertError} from './AlertError';
import {CenterContent} from './CenterContent';

import {errorRegistration} from '../redux/registration';
import {sagaRegistration, sagaGetAllRoles} from '../redux/sagas/registration';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required')
		                    .min(5, 'Username must be at least 5 characters')
		                    .max(255, 'Username must not exceed 255 characters'),
	password: Yup.string().required('Password is required')
		                    .min(6, 'Password must be at least 6 characters')
		                    .max(255, 'Password must not exceed 255 characters'),
  password2: Yup.string().required('Confirm Password is required')
                      	 .min(6, 'Confirm Password must be at least 6 characters')
                    		 .max(255, 'Confirm Password must not exceed 255 characters')
                      	 .oneOf([Yup.ref('password'), null as any], 'Passwords must match'),
  roles: Yup.array().required('Roles is required').min(1, 'At least one role must be selected').of(
    Yup.string().required('Role ID is required')
                .length(24, 'Role ID must be from 24 characters!!!')
  ),
});

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

export interface RegistrationProps {}

export const Registration: React.FC<RegistrationProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit, setValue, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);

  const error = useSelector((state: any) => state.registration.errorRegistration);
	const registration = useSelector((state: any) => state.registration.registration);
  const loadRegistration = useSelector((state: any) => state.registration.loadRegistration);

  const errorRoles = useSelector((state: any) => state.registration.errorRoles);
	const roles = useSelector((state: any) => state.registration.roles);
  const loadRoles = useSelector((state: any) => state.registration.loadRoles);

  const [selectedRoles, setSelectedRoles] = useState<Array<string>>([]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [iconUserDisabled, setIconUserDisabled] = useState<boolean>(false);
  const [iconPasswordDisabled, setIconPasswordDisabled] = useState<boolean>(false);
  const [iconPassword2Disabled, setIconPassword2Disabled] = useState<boolean>(false);
  const [iconRolesDisabled, setIconRolesDisabled] = useState<boolean>(false);

  const handleClickShowPassword: React.MouseEventHandler<HTMLElement> = () => setShowPassword((show) => !show);
  const handleMouseDownPassword: React.MouseEventHandler<HTMLElement> = (e) => {e.preventDefault();};

  const handleChangeRoles = (event: SelectChangeEvent<any>) => {
    const {target: {value},} = event;console.log(value);
    setSelectedRoles((typeof value === 'string')?value.split(','):value);
  };

  useEffect(() => {
		if(registration) {
      navigate('/user/quizs');
      //navigate('/admin/quizs');
		}
	}, [registration]);

  useEffect(() => () => {dispatch(errorRegistration(false))}, [registration]);

  useEffect(() => {
    dispatch(sagaGetAllRoles());
  }, []);

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
        <Typography variant="h4">Registration</Typography>
      </Grid>
      <Grid item xs={12} sx={{pt: 1, pb: 1}}>
        <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                console.log(data);
                dispatch(sagaRegistration(data));
              })}>
          <Grid container>
            {error?<Grid item xs={12} sx={{pt: 1, pb: 1}}>
              <AlertError onCloseAlert={() => dispatch(errorRegistration(false))}
                          error={error.error}
                          statusCode={error.statusCode}
                          message={error.message || error.reason}
                          defaultAlerttitleMessage={'Server Error Registration'}/>
            </Grid>:null}
            <Grid item xs={12} sx={{pt: 1}}>
              <Controller control={control}
                          name="username"
                          render={({field, fieldState: {error}}) => (
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadRegistration?true:false}>
                              <InputLabel htmlFor="adornment-username"
                                          sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                          error={!!errors.username}>
                                <Box sx={{display: 'flex'}}>
                                  <PersonIcon sx={{display: iconUserDisabled?'none':'inline'}} />
                                  <Typography sx={{pl: 1}}>{'Username'}</Typography>
                                </Box>
                              </InputLabel>
                              <OutlinedInput
                                {...field}
                                id="adornment-username"
                                autoComplete="off"
                                error={!!errors.username}
                                onFocus={(e) => {setIconUserDisabled(true)}}
                                onBlur={(e) => {setIconUserDisabled(e.target.value.length>0?true:false);}}
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
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadRegistration?true:false}>
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
                                autoComplete="new-password"
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
            <Grid item xs={12} sx={{pt: 1}}>
              <Controller control={control}
                          name="password2"
                          render={({field, fieldState: {error}}) => (
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={loadRegistration?true:false}>
                              <InputLabel htmlFor="adornment-password2"
                                          sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                          error={!!errors.password2}>
                                <Box sx={{display: 'flex'}}>
                                  <LockIcon sx={{display: iconPassword2Disabled?'none':'inline'}} />
                                  <Typography sx={{pl: 1}}>{'Confirm Password'}</Typography>
                                </Box>
                              </InputLabel>
                              <OutlinedInput
                                {...field}
                                id="adornment-password2"
                                autoComplete="new-password"
                                type={showPassword?'text':'password'}
                                error={!!errors.password2}
                                onFocus={(e) => {setIconPassword2Disabled(true)}}
                                onBlur={(e) => {setIconPassword2Disabled(e.target.value.length>0?true:false);}}
                                aria-describedby="password2-helper-text"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                color={!!errors.password2?'error':'inherit'}
                                                edge="end">
                                      {showPassword?<VisibilityOffIcon />:<VisibilityIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              <FormHelperText id="password2-helper-text" error={!!errors.password2}>
                                <Typography sx={{fontWeight: 'bold'}}>{errors.password2?.message as any}</Typography>
                              </FormHelperText>
                            </FormControl>
                          )}/>
            </Grid>
            <Grid item xs={12} sx={{pt: 1}}>
              <Controller control={control}
                          name="roles"
                          render={({field, fieldState: {error}}) => (
                            <FormControl sx={{}} variant="outlined" fullWidth={true} disabled={(loadRegistration || loadRoles)?true:false}>
                              <InputLabel htmlFor="adornment-roles"
                                          sx={{backgroundColor: 'white', borderRadius: '4px', pl: 1, pr: 1}}
                                          error={!!errors.roles}>
                                <Box sx={{display: 'flex'}}>
                                  <AccountTreeIcon sx={{display: iconRolesDisabled?'none':'inline'}} />
                                  <Typography sx={{pl: 1}}>{loadRoles?'Loading roles ...':'Selected roles'}</Typography>
                                </Box>
                              </InputLabel>
                              <Select {...field}
                                      id="adornment-roles"
                                      multiple={true}
                                      value={field.value || []}
                                      //onChange={handleChangeRoles}
                                      input={<OutlinedInput label="Selected roles" />}
                                      renderValue={(selected) => {
                                        return (<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                          {roles.filter((entry: any) => selected.indexOf(entry._id) > -1).map((entry: any) => (
                                            <Chip key={entry._id} label={entry.title} />
                                          ))}
                                        </Box>);
                                      }}
                                      error={!!errors.roles}
                                      aria-describedby="roles-helper-text"
                                      endAdornment={
                                        loadRoles?<InputAdornment position="start" sx={{pl: '1em', pr: '1em', color: 'gray'}}>
                                          <CircularProgress color="inherit" size='2em' />
                                        </InputAdornment>:null
                                      }
                                      onFocus={(e) => {setIconRolesDisabled(true)}}
                                      onBlur={(e) => {setIconRolesDisabled(e.target.value?.length>0?true:false);}}
                                      MenuProps={menuProps}>
                                {roles.map((entry: any) => {
                                  return (<MenuItem key={entry.role} value={entry._id}>
                                    <Checkbox checked={(field.value || []).indexOf(entry._id) > -1} />
                                    <ListItemText primary={entry.title} />
                                  </MenuItem>);
                                })}
                              </Select>
                              <FormHelperText id="roles-helper-text" error={!!errors.roles}>
                                <Typography sx={{fontWeight: 'bold'}}>{errors.roles?.message as any}</Typography>
                              </FormHelperText>
                            </FormControl>
                          )}/>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button component={NavLink} to='/login'
                    variant="outlined"
                    color="info"
                    disabled={loadRegistration?true:false}
                    startIcon={<LoginIcon color="inherit" sx={{width: 24, height: 24}} />}>
              <Box><Typography sx={{fontWeight: 'bold'}}>{'Sign in'}</Typography></Box>
            </Button>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button variant="outlined" color="secondary" size="large"
                    startIcon={<ClearAllIcon color="inherit" sx={{width: 24, height: 24}} />}
                    onClick={() => {
                      reset({
                        username: '',
                        password: '',
                        password2: '',
                        roles: [],
                      });
                      dispatch(errorRegistration(false));
                    }} disabled={loadRegistration?true:false}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Reset'}
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {!loadRegistration?<Button variant="contained" color="success" size="large"
                                       startIcon={<AppRegistrationIcon color="inherit" sx={{width: 24, height: 24}} />}
                                       onClick={() => {
                                         dispatch(errorRegistration(false));
                                         formRef.current.requestSubmit();
                                       }}>
              <Typography sx={{fontWeight: 'bold'}}>
                {'Sign up'}
              </Typography>
            </Button>:<LoadingButton loading={true}
                                     sx={{minWidth: '100px'}}
                                     loadingPosition="start"
                                     startIcon={<SaveIcon />}
                                     variant="outlined">
              <Typography sx={{fontWeight: 'bold'}}>
                {'Sign up...'}
              </Typography>
            </LoadingButton>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box></CenterContent>);
}
