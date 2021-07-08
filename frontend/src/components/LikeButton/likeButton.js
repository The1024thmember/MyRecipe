import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import HostUrl from 'config';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useCookies } from 'react-cookie';

export default function LikeButton ({ curUserId, recipeId, numberofLikes }) {
  const [liking, setLiking] = useState(false);
  const [cookies] = useCookies(['token']);
  const [mynumberofLikes, setMyNumberofLikes] = useState(numberofLikes);
  const getisLikedbyuser = async () => {
    // API settings
    const settings = {
      method: 'GET',
      Accept: 'application/json',
      "Content-Type": 'application/json',
      headers: {
        Authorization: cookies.token
      },
    }
    try {
      const response = await fetch(HostUrl('/user/like/' + recipeId), settings);
      const data = await response.json();
      setLiking(data.liking);
    } catch (error) {
      console.error(error);
    }
  }

  const putLike = async () => {
    // API settings
    const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": recipeId,
      }),
    }
    console.log("Trying to like");
    try {
      const response = await fetch(HostUrl('/user/like'), settings);
      if (response.ok) {
        console.log("Successfully liked the recipe");
        setMyNumberofLikes(mynumberofLikes+1);
        setLiking(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const putUnLike = async () => {
     // API settings
     const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": recipeId,
      }),
    }
    console.log("Trying to unlike");
    try {
      const response = await fetch(HostUrl('/user/dislike'), settings);
      if (response.ok) {
        console.log("Successfully unliked the recipe");
        setMyNumberofLikes(mynumberofLikes-1);
        setLiking(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    if (liking) {
      putUnLike();
    } else {
      putLike();
    }
  }

  useEffect(() => {
    getisLikedbyuser();
  }, [liking]);

  return (
    <div style={{
      marginTop: '15px',
    }}>
      <IconButton
        aria-label="add to favorites" 
        onClick={handleClick}
      > 
        <FavoriteIcon style={liking? {fill: '#e94659'}:{}}/>
      </IconButton>{mynumberofLikes}
    </div>
  );
}
