import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from 'components/Header/header';
import 'styles/pages/userGallery.css';
import  { RecipeReviewCard }  from 'components/RecipeCard/recipeCard.js';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';
import BackButton from 'components/BackButton/backButton';
import HostUrl from 'config';
import { useCookies } from 'react-cookie';
import LoadingScreen from 'components/Loader/loadingScreen';
import FollowButton from 'components/FollowButton/followButton';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';
import styles from 'styles/components/tabStyles';
import { makeStyles } from '@material-ui/core';


function useRouter() {
  const params = useParams();
  return useMemo(() => {
    return {
      query: {
        ...params,
      },
    };
  }, [params]);
}

const useStyles = makeStyles(styles);

export default function UserGallery() {
  const classes = useStyles(styles);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const userId = router.query.userId;
  const [cookies] = useCookies(['token']);

  // Define numebr of page number and page size
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;

  // Variables
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [focusRecipeId, setFocusRecipeId] = React.useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // get data for the user profile
  const getProfile = async () => { 
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
      }
    };
    try {
      // const response = await fetch(HostUrl('/user/' + userId + '?page=' + pageNumber + '&size=' + pageSize), settings);
      const response = await fetch(HostUrl('/profile/' + userId), settings);
      if (response.status === 200) {
        const data = await response.json();
        setUsername(data.username);
        setFullname(data.fullName);
        setEmail(data.email);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
    }
  };

  const getFollowing = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
      }
    }
    try {
      const response = await fetch(HostUrl('/user/follows'), settings);
      if (response.status === 200) {
        const data = await response.json();
        setFollowingNum(data.numberOfFollows);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const getFollower = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
      }
    }
    try {
      const response = await fetch(HostUrl('/user/followers'), settings);
      if (response.status === 200) {
        const data = await response.json();
        setFollowerNum(data.numberOfFollowers);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const getRecipes = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }

    try {
      const recipeResponse = await fetch(
        HostUrl(
          '/recipe/user/' + userId + '?page=' + pageNumber + '&size=' + pageSize
        ),
        settings);
        if (recipeResponse.status === 200) {
          setPageNumber(pageNumber + 1);
          const data = await recipeResponse.json();

          if (data.content.length === 0) {
            setHasMore(false);
            return;
          } else {
            console.log(data.content);
            const oldRecipes = [...recipes];
            const newRecipes = oldRecipes.concat(data.content);
            
            setRecipes(newRecipes);
            setNumOfPosts(newRecipes.length);
          }
        }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
      console.error(err);
    }
  }

  useEffect(() => {
    setLoading(true);
    getProfile();
    getRecipes();
    getFollowing();
    getFollower();
    setLoading(false);
  }, []);

  return (
    <>
      {loading ?
      <LoadingScreen loading={loading} />
      : <>
        <Header rightLink={<BackButton />}/>
        <div id="profile-parallax" />
        <div id="user-main-container">
          <div id="profile-container">
            <div id="avatar-container">
              <Avatar
                className="avatar-icon"
                alt={fullname.charAt(0).toUpperCase()}
                src="/broken-image.jpg"
              />
            </div>
            <div id="user-content-container">
              <h1>{fullname}</h1>
              <h3>{email.toLowerCase()}</h3>
            </div>
            <FollowButton curUserId={userId} followers={followerNum} setFollowers={setFollowerNum}/>
            <div id="ff-container">
              <div className="posts">
                <h2>Posts</h2>
                <h3>{numOfPosts}</h3>
              </div>
              <div className="following">
                <h2>Followers</h2>
                <h3>{followerNum}</h3>
              </div>
              <div className="followers">
                <h2>Following</h2>
                <h3>{followingNum}</h3>
              </div>
            </div>
          </div>
          <div className="title-container">
            <h1>Latest Posts</h1>
          </div>
          {/* {recipes.map((val, key) => {
            return (
              <div className='singlerecipe' key={key}> 
                <RecipeReviewCard
                  id={val.id}
                  author={fullname}
                  userId={val.userId}
                  postdate={val.updateTime} // change it to real value, depends on the structure of myrecipe
                  thumbnail={val.image} // change it to real value, depends on the structure of myrecipe
                  title={val.name} //replace this with value read from database
                  description={val.description}
                  numberoflikes={val.numberOfLikes}
                  numberofcomments={val.numberOfComments}
                  isprivate={username === cookies.username}
                  setfocusrecipeid={setFocusRecipeId}
                /> 
              </div>	
            );
          })} */}
          <InfiniteScroll
            dataLength={recipes.length}
            next={getRecipes}
            hasMore={hasMore}
            loader={
            <div className={classes.loaderContainer}>
              <PulseLoader color={'darkgray'} loading={true} />
            </div>}
            className="recipe-container"
            endMessage={
              <div className={classes.loaderContainer}>
                <b>Yay! You have seen it all</b>
              </div>
            }
          >
            {/* {recipes.map((val, key) => {
              return (
                <div className='singlerecipe' key={key}> 
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
            })} */}
          </InfiniteScroll>
        </div>
      </>}
    </>
  );
}

