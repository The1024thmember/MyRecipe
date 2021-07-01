import React from 'react';
import 'styles/components/commentCardStyles.css';
import Avatar from '@material-ui/core/Avatar';

export default function CommentCard ({ author, message }) {
  return (
    <div className="container">
      <Avatar />
      <div className="content">
        <h4>{author}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
}