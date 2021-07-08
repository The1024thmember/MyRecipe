import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import HostUrl from 'config';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

export default function CommentButton ({ curUserId, recipeId, numberofComments }) {
  const [commenting, setCommenting] = useState(false);
  const [cookies] = useCookies(['token']);
  const [mynumberofComments, setMymyNumberofComments] = useState(numberofComments);
  const history = useHistory();
  
  const handleClick = () => {
    //navigate to detailed recipe page for now
    history.push('/recipe/'+recipeId);  
  }

  return (
    <div style={{
      marginTop: '15px',
    }}>
      <IconButton
        aria-label="add to favorites" 
        onClick={handleClick}
      > 
        <ChatIcon style={commenting? {fill: '#3c6dd3'}:{}}/>
      </IconButton>{mynumberofComments}
    </div>
  );
}
