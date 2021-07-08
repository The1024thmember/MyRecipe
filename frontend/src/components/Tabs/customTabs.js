import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';
import styles from 'styles/components/tabStyles';
import { RecipeReviewCard } from 'components/RecipeCard/recipeCard';
import { useCookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import HostUrl from 'config';
import PulseLoader from 'react-spinners/PulseLoader';

const useStyles = makeStyles(styles);
export default function CustomTabs ({ feed, liked, explore }) {
  const classes = useStyles();
  const [cookies] = useCookies(['token']);
  const [value, setValue] = useState(0);
  const [focusRecipeId, setFocusRecipeId] = React.useState('');
  const [feedRecipes, setFeedRecipes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 6;
  const [pageNum, setPageNum] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log("fetching");
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const settings = {
      method: 'GET',
      headers: {
        Authorization: cookies.token,
        Accept: 'application/json',
      }
    };
    try {
      console.log("loading");
      const response = await fetch(HostUrl('/user/feed?page=' + pageNum + '&size=' + pageSize), settings);
      const data = await response.json();
      console.log("got the data");
      console.log(data);
      setPageNum(pageNum + 1);
      if (data.content.length === 0) {
        console.log('recieved empty data');
        setHasMore(false);
        return;
      } else {
        const oldFeedRecipes = [...feedRecipes];
        const newFeedRecipes = oldFeedRecipes.concat(data.content);
        setFeedRecipes(newFeedRecipes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.tab}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
        centered
      >
        <Tab label="Your Feed" />
        <Tab label="Liked" />
        <Tab label="Explore" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InfiniteScroll
          dataLength={feedRecipes.length}
          next={fetchFeed}
          hasMore={hasMore}
          loader={
          <div className={classes.loaderContainer}>
            <PulseLoader color={'darkgray'} loading={true} />
          </div>}
          className={classes.feedContainer}
          endMessage={
            <div className={classes.loaderContainer}>
              <b>Yay! You have seen it all</b>
            </div>
          }
        >
          {feedRecipes.map((val, key) => {
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        Liked Page
      </TabPanel>
      <TabPanel value={value} index={2}>
        Explore
      </TabPanel>
    </div>
  );
};

function TabPanel (props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
CustomTabs.propTpyes = {
  feed: PropTypes.array,
  liked: PropTypes.array,
  explore: PropTypes.array,
}