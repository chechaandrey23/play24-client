import React, {ReactElement, ReactPortal} from 'react';
import {Grid, Box, Paper, Typography, Card, CardActions, CardActionArea, CardContent, CardHeader, CardMedia,
        Tooltip, IconButton, Fab, TextField, Button, Alert} from '@mui/material';

type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {};
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

export type CenterContentProps = {
  children: React.ReactNode;// | Array<React.ReactNode> | ReactFragment | ReactPortal | boolean | null | undefined;
}

export const CenterContent: React.FC<CenterContentProps> = (props: CenterContentProps) => {

  return (<Paper sx={{minHeight: 'calc(var(--content-height))', mt: 0.5, mb: 0.5, pr: 1, pl: 1, borderRadius: 0}}>
    <Box sx={{width: '100%', minHeight: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {props.children}
    </Box>
  </Paper>);
}
