import React from 'react';
import SearchBar from 'material-ui-search-bar';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import recipeStore from './recipeStore';

import { makeStyles } from '@material-ui/core/styles';
import styles from 'styles/components/searchBarStyles';
const useStyles = makeStyles(styles);

export default function CustomSearchBar () {
  const classes = useStyles();
  return (
    <div className={classes.searchbar}>
      <SearchBar
        // onRequestSearch={recipeStore.fetchRecipes}
        placeholder="Search for Awesome Recipes"
      />
      {/* {recpieStore.isLoading && <LinearProgress />} */}
    </div>
  );
}