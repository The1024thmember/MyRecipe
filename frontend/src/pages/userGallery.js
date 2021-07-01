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

export default function UserGallery() {
  const router = useRouter();
  const userId = router.query.userId;
  const [cookies] = useCookies(['token']);

  // Define numebr of page number and page size
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Variables
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [haveRecipe,sethaveRecipe] = useState(true);
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [focusRecipeId, setFocusRecipeId] = React.useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // get data for the profile, username, email, recipes...
  const getData = async () => { 
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
      }
    };
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/user/' + userId + '?page=' + pageNumber + '&size=' + pageSize), settings);
      if (response.status === 200) {
        const data = await response.json();
        setUsername(data.username);
        setFullname(data.fullName);
        setEmail(data.email);
        setFollowingNum(data.followingListNumber);
        setFollowerNum(data.followerListNumber);
        setRecipes(data.pageRecipeEntity.content);
        setNumOfPosts(data.pageRecipeEntity.content.length);
        if (data.pageRecipeEntity.content) sethaveRecipe(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
    }
  };

  useEffect(() => {
    getData();
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
          <div id="recipe-container">
            {recipes.map((val, key) => {
              return (
                <div className='singlerecipe' key={key}> 
                  <RecipeReviewCard
                    id={val.id}
                    author={fullname}
                    userId={val.userId}
                    postdate={val.updateTime} // change it to real value, depends on the structure of myrecipe
                    thumbnail={val.thumbnail} // change it to real value, depends on the structure of myrecipe
                    title={val.name} //replace this with value read from database
                    description={val.description}
                    numberoflikes={150}
                    numberofcomments={38}
                    isprivate={username === cookies.username}
                    setfocusrecipeid={setFocusRecipeId}
                  /> 
                </div>	
              );
            })}
          </div>
        </div>
      </>}
    </>
  );
}

