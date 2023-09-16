import * as React from 'react';
import {useRef, useEffect, useCallback} from 'react';
import {Container, Box, Typography, Grid, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip} from '@mui/material';
import {InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Checkbox, FormControlLabel} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';

import {AlertError} from './AlertError';

import {errorLogout as errorLogoutAC} from '../redux/auth';
import {sagaLogout} from '../redux/sagas/auth';

const validationSchema = Yup.object().shape({
  fullExit: Yup.boolean().required('Full-Exit is required'),
});

export interface LogoutDialogProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = (props) => {
  const dispatch = useDispatch();

  const {register, handleSubmit, setValue, reset, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

  const formRef = useRef<any>(null);

  const errorLogout = useSelector((state: any) => state.auth.errorLogout);
	const logout = useSelector((state: any) => state.auth.logout);
  const loadLogout = useSelector((state: any) => state.auth.loadLogout);

  const handleOKClose = useCallback(() => {
		//dispatch(sagaLogout());
    formRef.current.requestSubmit();
	}, []);

	useEffect(() => {
    if(logout) {
      props.onSuccess?.call(null);
    }
	}, [logout]);

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

  return (<Dialog open={true}
                  fullScreen={false}
                  scroll={'body'}
                  fullWidth={true}
                  onClose={!loadLogout?props.onClose:undefined}
                  maxWidth={'sm'}>
    <DialogTitle>
      <Typography variant="h6">
        {'Dialog Confirm Logout'}
      </Typography>
      <Tooltip title={'Close Dialog'} arrow={true}>
        <IconButton aria-label="close"
                    color="secondary"
                    size="large"
                    disabled={loadLogout}
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
        {errorLogout?<Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
          <AlertError onCloseAlert={() => dispatch(errorLogoutAC(false))}
                      error={errorLogout.error}
                      statusCode={errorLogout.statusCode}
                      message={errorLogout.message || errorLogout.reason}
                      defaultAlerttitleMessage={'Server Error Logout'}/>
        </Grid>:null}
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
          <Alert severity="warning" sx={{pt: 3, pb: 3, width: '100%'}}>
            <Typography variant="h6" sx={{fontWeight: 'bold', ml: 3}}>
              {'Are you sure you want to leave the admin area of ​​the site?'} {'Most of the functionality will be unavailable!'}
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12} sx={{pt: 1, pb: 1, pl: 2}}>
          <Box component="form" ref={formRef} onSubmit={handleSubmit((data) => {
                  console.log(data);
                  dispatch(sagaLogout(data));
                })}>
            <Grid container>
              <Grid item xs={12} sx={{pt: 1}}>
                <Controller control={control}
                            name="fullExit"
                            defaultValue={false}
                            render={({field, fieldState: {error}}) => (
                              <FormControlLabel control={
                                <Checkbox {...field}
                                          disabled={loadLogout?true:false}
                                          sx={{ '& .MuiSvgIcon-root': {fontSize: 32}}} />
                              } label={<Box>
                                <Typography variant="h6" sx={{fontWeight: 'bold', ml: 1}}>
                                  {'Logout from All clients!'}
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
              onClick={props.onClose} disabled={loadLogout}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Close'}
        </Typography>
      </Button>
      {!loadLogout?<Button variant="contained" color="warning" size="large"
                           startIcon={<LogoutIcon color="inherit" sx={{width: 32, height: 32}} />}
                           onClick={handleOKClose}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Logout'}
        </Typography>
      </Button>:<LoadingButton loading
                               size="large"
                               loadingPosition="start"
                               startIcon={<SaveIcon color="inherit" sx={{width: 32, height: 32}} />}
                               variant="outlined">
        <Typography sx={{fontWeight: 'bold'}}>
          {'Logouting...'}
        </Typography>
      </LoadingButton>}
    </DialogActions>
  </Dialog>);
}
