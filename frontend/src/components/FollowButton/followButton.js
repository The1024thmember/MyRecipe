import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import HostUrl from 'config';
import { useCookies } from 'react-cookie';

export default function FollowButton ({ curUserId, followers, setFollowers }) {
  const [hasFollowed, setHasFollowed] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [cookies] = useCookies(['token']);

  const getData = async (signal) => {
    // API settings
    const settings = {
      method: 'GET',
      Accept: 'application/json',
      "Content-Type": 'application/json',
      headers: {
        Authorization: cookies.token
      },
      signal: signal,
    }
    try {
      const response = await fetch(HostUrl('/user/follow/' + curUserId), settings);
      const data = await response.json();
      setHasFollowed(data.following);
      if (data.following === true) {
        setButtonText("Unfollow");
      } else {
        setButtonText("Follow");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const putFollow = async () => {
    // API settings
    const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": curUserId,
      }),
    }
    console.log("Trying to Follow");
    try {
      const response = await fetch(HostUrl('/user/follow'), settings);
      if (response.ok) {
        console.log("Successfully follow the user");
        setButtonText("Unfollow");
        setHasFollowed(true);
        setFollowers(followers + 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const putUnFollow = async () => {
     // API settings
     const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": curUserId,
      }),
    }
    console.log("Trying to unfollow");
    try {
      const response = await fetch(HostUrl('/user/unfollow'), settings);
      if (response.ok) {
        console.log("Successfully unfollow the user");
        setButtonText("Follow");
        setHasFollowed(false);
        setFollowers(followers - 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    if (hasFollowed) {
      putUnFollow();
    } else {
      putFollow();
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getData(signal);

    return function cleanup() {
      abortController.abort();
    }
  }, [getData]);

  return (
    <div style={{
      marginTop: '15px',
    }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}

FollowButton.propTypes = {
  curUserId: PropTypes.string,
  followers: PropTypes.number,
  setFollowers: PropTypes.func,
}