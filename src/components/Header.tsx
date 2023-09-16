import React, {useEffect, useState} from 'react';
import {Grid, Box, Paper, Button, IconButton, Typography, AppBar, Toolbar, Tooltip, LinearProgress} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {NavLink, useMatches, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {useTheme, ThemeProvider, createTheme} from '@mui/material/styles';
import QuizIcon from '@mui/icons-material/Quiz';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';

import {LogoutDialog} from './LogoutDialog';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));

  const [match] = useMatches();

  const user = useSelector((state: any) => state.auth.user);
	const loadUser = useSelector((state: any) => state.auth.loadUser);

  return (<>
      <AppBar position="static" enableColorOnDark={true} color="inherit" sx={{height: 'var(--height-header)', justifyContent: 'center'}}>
        <Toolbar sx={{height: 'inherit'}}>
          <Grid container sx={{height: '100%', alignItems: 'center'}}>
            <Grid item sx={{alignItems: 'center', display: 'flex', height: 'inherit'}}>
              {user?<Box>
                <Typography variant="h6" sx={{}}>{`Hello <${user.username}>`}</Typography>
                <Box sx={{display: 'flex'}}>
                  <Typography variant={'body1'} sx={{color: 'text.secondary'}}>{`ID: `}</Typography>
                  <Typography variant={'body1'} sx={{color: 'text.secondary', ml: 1, fontWeight: 'bold'}}>{user._id}</Typography>
                </Box>
              </Box>:<Box>
                <Typography variant="h6" sx={{}}>{`Hello <Guest>`}</Typography>
              </Box>}
            </Grid>
            <Grid sx={{ flexGrow: 1 }}></Grid>
            <Grid item sx={{alignItems: 'center', display: 'flex', height: 'inherit'}}>
              {!isXS?<Button component={NavLink} to='/user/quizs'
                      variant="text"
                      color={match.pathname=='/user/quizs'?"success":"secondary"}
                      startIcon={<QuizIcon color="inherit" sx={{width: 24, height: 24}} />}
                      sx={{width: '100%', height: '100%'}}>
                <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}><Typography variant="h6">{'Quizs'}</Typography></Box>
              </Button>:<Tooltip title={'User Quizs'} arrow={true}>
                <IconButton component={NavLink} to='/user/quizs'
                            edge="start"
                            size="large"
                            color={match.pathname=="/user/quizs"?"success":"secondary"}>
                  <QuizIcon color="inherit" sx={{width: 32, height: 32}} />
                </IconButton>
              </Tooltip>}
            </Grid>
            <Grid item sx={{pl: 2, alignItems: 'center', display: 'flex', height: 'inherit'}}>
              {!isXS?<Button component={NavLink} to='/admin/quizs'
                      variant="text"
                      color={match.pathname.includes('/admin/quizs')?"success":"secondary"}
                      startIcon={<EditRoadIcon color="inherit" sx={{width: 24, height: 24}} />}
                      sx={{width: '100%', height: '100%'}}>
                <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}><Typography variant="h6">{'Admin Quizs'}</Typography></Box>
              </Button>:<Tooltip title={'Catalog'} arrow={true}>
                <IconButton component={NavLink} to='/admin/quizs'
                            edge="start"
                            size="large"
                            color={match.pathname.includes('/admin/quizs')?"success":"secondary"}>
                  <EditRoadIcon color="inherit" sx={{width: 32, height: 32}} />
                </IconButton>
              </Tooltip>}
            </Grid>
            <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <HeaderTail />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
  </>);
}

export interface HeaderTailProps {}

export const HeaderTail: React.FC<HeaderTailProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModalLogout, setShowModalLogout] = useState<boolean>(false);

  const logout = useSelector((state: any) => state.auth.logout);
  const login = useSelector((state: any) => state.auth.login);

  const [match] = useMatches();

  return (<>
    {(login && !logout)?<>
      <Tooltip title={'Logout'} arrow={true}>
        <IconButton size="large"
                    edge="end"
                    onClick={() => setShowModalLogout(true)}
                    color="warning">
          <ExitToAppIcon color="inherit" sx={{width: 32, height: 32}} />
        </IconButton>
      </Tooltip>
      {showModalLogout?<LogoutDialog onClose={() => {setShowModalLogout(false)}}
                                    onSuccess={() => {
                                      setShowModalLogout(false);
                                      navigate('/login');
                                    }} />:null}
    </>:<>
      <Tooltip title={'Authorization'} arrow={true}>
        <IconButton component={NavLink} to='/login'
                    edge="end"
                    size="large"
                    color={match.pathname=="/login"?"info":"secondary"}>
          <LoginIcon color="inherit" sx={{width: 32, height: 32}} />
        </IconButton>
      </Tooltip>
    </>}
  </>);
}
