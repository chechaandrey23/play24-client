import React, {useEffect} from 'react';
import {Grid, Box, Paper, Typography, Badge,
        Tooltip, IconButton, Fab, TextField, Button, Alert, Skeleton, Pagination, Stack} from '@mui/material';
import {useNavigate, useParams, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

export interface UserQuizResultsProps {}

export const UserQuizResults: React.FC<UserQuizResultsProps> = () => {
  return (<>
    <h2>UserQuizResults</h2>
  </>);
}
