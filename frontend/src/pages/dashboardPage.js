import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styles from 'styles/pages/dashboardPageStyles'

// Components
import Header from 'components/Header/header';
import CustomSearchBar from 'components/SearchBar/searchBar';
import AvatarProfile from 'components/AvatarProfile/avatarProfile';
import CustomTabs from 'components/Tabs/customTabs';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(styles);

function LeftLink () {
  const classes = useStyles();
  const history = useHistory();
  const handlePostRecipeButton = () => {
    history.push('/postrecipe');
  }
  const handleSearchRecipeButton = () => {
    history.push('/searchrecipe');
  }
 
  return (
    <div className={classes.buttonContainer}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handlePostRecipeButton}
      >
        Post Recipe
      </Button>
      
      <Button
        variant="outlined"
        color="primary"
        onClick={handleSearchRecipeButton}
        style={{marginLeft:'20px'}}
      >
        <SearchIcon/>Search recipe
      </Button>
    </div>
  );
}



export default function DashboardPage () {
  const classes = useStyles();
  const [cookies] = useCookies(['token']);

  // useEffect(() => {
  //   window.location.reload(false);
  // }, []);

  return (
    <>
      <Header leftLink={<LeftLink />} rightLink={<AvatarProfile username={cookies.username}/>}/>
      <div className={classes.container}>
        {/*<CustomSearchBar />*/}
        <CustomTabs/>
      </div>
    </>
  );
}
