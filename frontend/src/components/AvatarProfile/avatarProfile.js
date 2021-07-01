import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';

import styles from 'styles/components/avatarProfileStyles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

export default function AvatarProfile ({username}) {
  const classes = useStyles();
  let history = useHistory();
  const handleAvatarClick = () => {
    history.push('/profile');
  }

  return (
    <div>
      <Avatar
        variant="square"
        alt={username.charAt(0).toUpperCase() + username.slice(1)}
        src="/broken-image.jpg"
        className={classes.avatar}
        onClick={handleAvatarClick}
      />
    </div>
  );
};