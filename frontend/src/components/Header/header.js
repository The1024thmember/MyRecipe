import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

// Logo
import logo from 'assets/img/chefhat_logo.png';

// Styles
import styles from 'styles/components/headerStyles';
const useStyles = makeStyles(styles);

export default function Header (props) {
  const history = useHistory();
  const classes = useStyles();

  const handleclick = () => {
    history.push('/dashboard');
  }

  return (
    <div className={classes.header}>
      <div className={classes.brandContainer}>
        <img className={classes.img} src={logo} alt="header-logo" />
        <Button className={classes.brand} onClick={handleclick}>My Recipe</Button>
        {props.leftLink}
      </div>
      {props.rightLink}
    </div>
  );
}