import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import 'styles/pages/searchPageStyle.css';
import logo from 'assets/img/logo.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from 'styles/components/tabStyles';
import HostUrl from 'config';

// Components
import Header from 'components/Header/header';
import Button from '@material-ui/core/Button';
import AvatarProfile from 'components/AvatarProfile/avatarProfile';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { RecipeReviewCard } from 'components/RecipeCard/recipeCard';
import PulseLoader from 'react-spinners/PulseLoader';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(styles);

function LeftLink () {
  const history = useHistory();
  const handlePostRecipeButton = () => {
    history.push('/postrecipe');
  }
  return (
    <div className='buttonContainer'>
      <Button
        variant="outlined"
        color="primary"
        onClick={handlePostRecipeButton}
      >
        Post Recipe
      </Button>
    </div>
  );
}

export default function SearchPage () {
  const [cookies] = useCookies(['token']);  
  const [searchedRecipe, setSearchedRecipe] = useState([]);
  const pageSize = 9;
  const [feedPageNum, setFeedPageNum] = useState(0);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchMealType, setSearchMealType] = useState('');
  const [searchIngredient, setSearchIngredient] = useState('');
  const [searchMethod, setSearchMethod] = useState('');
  const [findMatch,setFindMatch] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  
  const searchRecipe = async () => {
    const settings = {
      method: 'GET',
      headers: {
        Authorization: cookies.token,
        Accept: 'application/json',
      }
    };
    console.log('searchMealType:'+searchMealType);
    try {
      const response = await fetch(HostUrl('/recipe/search?ingredient=' + searchIngredient + '&mealType=' + searchMealType + '&method=' + searchMethod + '&name=' + searchName + '&page=' + feedPageNum + '&size=' + pageSize), settings);
      const data = await response.json();
      console.log(data);
      setFeedPageNum(feedPageNum + 1);
      if (data.content.length === 0) {
        setFeedHasMore(false);
        setFindMatch(false);
        return;
      } else {
        const oldSearchedRecipes = [...searchedRecipe];
        const newSearchedRecipes = oldSearchedRecipes.concat(data.content);
        setSearchedRecipe(newSearchedRecipes);
        setFindMatch(true);
      }
    } catch (error) {
      console.error(error);
    }
  };  
  
  
  const handleChangeName=(e)=>{
    setSearchName(e.target.value);
  };
  const handleMealTypeChange=(e)=>{
    setSearchMealType(e.target.value);
  };
  const handleChangeIngredient=(e)=>{
    setSearchIngredient(e.target.value);
  };
  const handleChangeMethod=(e)=>{
    setSearchMethod(e.target.value);
  };
  const handlerefreashSearchRequest=(e)=>{
    setFeedPageNum(0);
    setSearchedRecipe([]);
  };
  const handleSubmitSearchRequest=()=>{
    searchRecipe();
    setIsLoading(true);
  };
  return <>
      <Header leftLink={<LeftLink />} rightLink={<AvatarProfile username={cookies.username}/>}/>
      <Container component="main"  maxWidth="sm">  
        <div className='logo'>
          <img className='img' src={logo} alt="logo" />
        </div>
      <div>
        <div className = 'searchItemContainer'>
          <Grid container spacing={1} >
            <Grid item xs={4}> 
              <TextField className="searchName"
                variant="outlined"
                label="Name *"
                onChange={handleChangeName}
              />
            </Grid>
            <Grid item xs={3} >
              <FormControl variant="outlined" className='mealType'>
                <InputLabel id="meal-type-outlined-label">Meal Type *</InputLabel>
                <Select
                  labelId="meal-type-label"
                  id="meal-type"
                  onChange={handleMealTypeChange}
                  label="Meal Type"
                >
                  <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"Lunch"}>Lunch</MenuItem>
                  <MenuItem value={"Brunch"}>Brunch</MenuItem>
                  <MenuItem value={"Dinner"}>Dinner</MenuItem>
                  <MenuItem value={"Dessert"}>Dessert</MenuItem>
                  <MenuItem value={"Beverage"}>Beverage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} >
              <TextField className="searchIngredient"
              variant="outlined"
              label="Ingredient *"
              onChange={handleChangeIngredient}
              />
            </Grid>
            <Grid item xs={1} >
              <Button className='searchButton'
                labelStyle={{ fontSize: '40px' }}
                variant="outlined"
                color="primary"  
                onMouseDown={handlerefreashSearchRequest} 
                onMouseUp={handleSubmitSearchRequest}
              >
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="methodContainer">
            <Grid item xs={12}> 
              <TextField className="searchMethod"
                variant="outlined"
                label="Method *"
                onChange={handleChangeMethod}
              />
            </Grid>        
          </Grid>
        </div>  
      </div>
      <div>
      
        <DisplayRecipes 
          searchedRecipe = {searchedRecipe}
          searchRecipe = {searchRecipe}
          feedHasMore = {feedHasMore}
          isloading = {isloading}
        />
      
      
      </div>
      </Container>
  </>
}

const DisplayRecipes=({searchedRecipe, searchRecipe, feedHasMore, isloading})=>{
  const classes = useStyles();
  const [focusRecipeId, setFocusRecipeId] = React.useState('');
  return <>
  <div className='RecipeContainer'>
    <InfiniteScroll
      dataLength={searchedRecipe.length}
      next={searchRecipe}
      hasMore={feedHasMore}
      loader={
      <div className={classes.loaderContainer}>
        <PulseLoader color={'darkgray'} loading={isloading} />
      </div>}
      className={classes.feedContainer}
      endMessage={
        <div className={classes.loaderContainer}>
          <b>{searchRecipe.length>1 ? 'Yay! You have seen it all':''}</b>
        </div>
      }
    >
      {searchedRecipe.map((val, key) => {
        return (
          <div className={classes.singleRecipeContainer} key={key}> 
            <RecipeReviewCard
              id={val.id}
              userId={val.userId}
              author={val.fullName}
              postdate={val.updateTime} 
              thumbnail={val.image}
              title={val.name}
              description={val.description}
              numberoflikes={val.numberOfLikes}
              numberofcomments={val.numberOfComments}
              isprivate={false}
              setfocusrecipeid={setFocusRecipeId}
            /> 
            <p>{val.key}</p>
          </div>
        );
      })}
      </InfiniteScroll>        
  </div>
  </>
}


const DisplayNoMatch=()=>{
  
  return <>
    <h1>Sorry, we couldn't find a recipe match your input</h1>
  </>
}