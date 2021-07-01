import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styles from 'styles/pages/dashboardPageStyles'

// Components
import Header from 'components/Header/header';
import CustomSearchBar from 'components/SearchBar/searchBar';
import AvatarProfile from 'components/AvatarProfile/avatarProfile';
import Tabs from 'components/Tabs/customTabs';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(styles);

function LeftLink () {
  const history = useHistory();
  const handlePostRecipeButton = () => {
    history.push('/postrecipe');
  }

  const classes = useStyles();
  return (
    <div className={classes.buttonContainer}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handlePostRecipeButton}
      >
        Post Recipe
      </Button>
    </div>
  )
}

export default function DashboardPage () {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);
  return (
    <div>
      <Header leftLink={<LeftLink />} rightLink={<AvatarProfile username={cookies.username}/>}/>
      <div className={classes.container}>
        <CustomSearchBar />
        <Tabs />
      </div>
    </div>
  );
}
