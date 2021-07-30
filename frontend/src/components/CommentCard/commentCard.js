import React, { useState, useEffect } from 'react';
import 'styles/components/commentCardStyles.css';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import { IconButton } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import HostUrl from 'config';
import Grid from '@material-ui/core/Grid';
// import WarningDialog from 'components/Dialog/warningDialog';

const useStyles = makeStyles((theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    position: 'relative',
    margin: 'auto',
  }
}));


const EditComponent = ({ setter, message }) => {
  return (
    <div className="edit-comment-container">
      <TextField variant="standard" label="Edit comment" fullWidth
        value={message}
        multiline
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  );
}

export default function CommentCard ({ id, author, message, createTime, deleteComment }) {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [commentMessage, setCommentMessage] = useState(message);
  const [isEdited, setIsEdited] = useState(false);

  // const [warningMessage, setWarningMessage] = useState('');
  // const [showWarning, setShowWarning] = useState(false);
  // const [warningFeedback, setWarningFeedback] = useState('no');
  const getContent = () => {
    const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(HostUrl('/comment/'+id), settings)
      .then(res => res.json())
      .then(data => setCommentMessage(data.content));
  }

  useEffect(() => {
    getContent();
  });

  const handleDelete = async () => {
    // setShowWarning(true);
    // setWarningMessage('Are you sure you want to delete this comment?');
    // if (warningFeedback  === 'yes') {
    const settings = {
      method: 'DELETE',
      headers: {
        Authorization: cookies.token,
        'Content-Type': 'application/json'
      }
    }
    try {
      await fetch(HostUrl('/user/comment/' + id), settings);
      deleteComment(id);
    } catch (err) {
      console.error(err);
    }
    // setWarningFeedback('no');   // reset warning feedback
    // }
  }

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedComment(message);
  }

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditedComment('');
  }

  const handleEditSubmit = async () => {
    const settings = {
      method: 'PUT',
      headers: {
        Authorization: cookies.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: editedComment,
        replyTo: 0,
      })
    }
    console.log(settings);
    try {
      await fetch(HostUrl('/user/comment/' + id), settings);
      setCommentMessage(editedComment);
      setIsEdited(true);
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      {/* <div className="content-container"> */}
      <Grid container className="content-container" spacing={1}>
        <Grid item xs={1}>
          <Avatar className={classes.orange} alt={author.charAt(0).toUpperCase()} src="/broken-image.jpg"/>
        </Grid>
        <Grid item xs={9}>
          <div className="content">
            <h4>{author}</h4>
            {isEditMode ?  <EditComponent setter={setEditedComment} message={editedComment}/>
            : <p>{commentMessage}</p>}
            <div className="date-container">
              <p>{createTime}</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={2}>
          {author === cookies.username
          ? <div className="action-buttons">
            <IconButton aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            {!isEditMode ? 
              <IconButton aria-label="edit" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            : <>
              <IconButton aria-label="edit" onClick={handleEditSubmit}>
                <CheckIcon />
              </IconButton>
              <IconButton aria-label="edit" onClick={cancelEdit}>
                <CloseIcon />
              </IconButton>
            </>}
          </div>
          : ''}
        </Grid>
      </Grid>
        
        
      {/* </div> */}
      
    </div>
  );
}