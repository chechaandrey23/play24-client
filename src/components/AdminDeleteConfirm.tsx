import * as React from 'react';
import {useRef, useEffect, useCallback} from 'react';
import {Container, Box, Typography, Grid, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText,
        IconButton, Button, TextField, Alert, AlertTitle, Skeleton, Tooltip} from '@mui/material';
import {InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import {LoadingButton} from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';

export interface AdminDeleteConfirmProps {
  onSuccess?: () => void;
  onClose: () => void;
  message: string;
  title: string;
  confirmButtonTitle?: string;
}

export const AdminDeleteConfirm: React.FC<AdminDeleteConfirmProps> = (props) => {
  const dispatch = useDispatch();

  const handleOKClose = useCallback(() => {
		props.onSuccess?.call(null);
	}, []);

  return (<Dialog open={true}
                  fullScreen={false}
                  scroll={'body'}
                  fullWidth={true}
                  onClose={props.onClose}
                  maxWidth={'sm'}>
    <DialogTitle>
      <Typography variant="h6">
        {props.title}
      </Typography>
      <Tooltip title={'Close Dialog'} arrow={true}>
        <IconButton aria-label="close"
                    color="secondary"
                    size="large"
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
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
          <Alert severity="warning" sx={{pt: 3, pb: 3, width: '100%'}}>
            <Typography variant="h6" sx={{fontWeight: 'bold', ml: 3}}>
              {props.message}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions sx={{display: 'flex', justifyContent: 'center', pb: 3}}>
      <Button variant="outlined" color="secondary" size="large"
              startIcon={<ReplyIcon color="inherit" sx={{width: 32, height: 32}} />}
              onClick={props.onClose}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'Close'}
        </Typography>
      </Button>
      <Button variant="contained" color="error" size="large"
              startIcon={<DeleteIcon color="inherit" sx={{width: 32, height: 32}} />}
              onClick={handleOKClose}>
        <Typography sx={{fontWeight: 'bold'}}>
          {props.confirmButtonTitle ?? 'Delete'}
        </Typography>
      </Button>
    </DialogActions>
  </Dialog>);
}
