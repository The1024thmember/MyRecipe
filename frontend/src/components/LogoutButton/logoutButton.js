import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import HostUrl from 'config';

import LoadingScreen from 'components/Loader/loadingScreen';
import { makeStyles } from '@material-ui/core/styles';

const styles = {
  buttonStyle: {
    marginLeft: '30px',
  }
}

const useStyles = makeStyles(styles);

export default function LogoutButton () {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const handleClick = async () => {
    const token = cookies.token;
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    }
    setLoading(true);
    try {
      await fetch(HostUrl('/logout'), settings);
      setLoading(false);
      removeCookie("token");
      removeCookie("username");
      history.push('/login');
    } catch (err) {
      console.log(err);
    }
    
  }

  return (
    <>
      <Button
        className={classes.buttonStyle}
        variant="outlined"
        color="secondary"
        startIcon={<MeetingRoomIcon />}
        onClick={handleClick}
      >
        Logout
      </Button>
      <LoadingScreen loading={loading} />
    </>
  )
}