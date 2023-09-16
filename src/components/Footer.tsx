import * as React from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

export interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (<>
    <Paper sx={{borderRadius: '0px', display: 'flex', height: 'var(--footer-height)', justifyContent: 'center', alignItems: 'center'}}>
      <CopyrightIcon /><Typography variant="subtitle1">Test task with using NestJS & React</Typography>
    </Paper>
  </>);
}
