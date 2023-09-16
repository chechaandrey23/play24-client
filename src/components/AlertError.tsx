import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {Grid, Box, Paper, Typography, Alert, AlertTitle, Button,
        InputAdornment, OutlinedInput, FormHelperText, FormControl, InputLabel,
        IconButton} from '@mui/material';

export interface AlertErrorProps {
  onCloseAlert?: () => void;
  error?: string;
  statusCode?: number;
  message: string|Array<string>;
  defaultAlerttitleMessage: string;
}

export const AlertError: React.FC<AlertErrorProps> = (props) => {
  const message: Array<string> = Array.isArray(props.message)?props.message:[props.message];
  return (
    <Alert severity="error" onClose={props.onCloseAlert?props.onCloseAlert:undefined} sx={{width: 'inherit'}}>
      <AlertTitle>
        <Typography variant="h6">{(props.error && props.statusCode)?props.statusCode+' => '+props.error:props.defaultAlerttitleMessage}</Typography>
      </AlertTitle>
      <Box>
        <Typography variant="body1">
          <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
            {message.map((item: string, index: number) => <li key={index+1}>{item}</li>)}
          </ul>
        </Typography>
      </Box>
    </Alert>
  );
}
