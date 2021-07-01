import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/uploadImage.css';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';

import UploadIcon from 'assets/img/outbox.png';

export default function UplaodImage ({ picture, setPicture, setThumbnail }) {
  const handleDelete = () => {
    setPicture(undefined);
    setThumbnail(undefined);
    document.getElementById("fileform").reset();
  }

  const resizeImage = (imgEl, wantedWidth) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // set its dimension to target size
    const aspect = imgEl.width / imgEl.height;
    canvas.width = wantedWidth;
    canvas.height = wantedWidth / aspect;

    // draw source image into the off-screen canvas
    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    
    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    console.log("changing images");
    reader.onloadend = () => {
      // Set the original image to "picture" variable
      setPicture(reader.result);

      // Set thumbnail by resizing the image
      const thumbnail = document.createElement('img');
      thumbnail.addEventListener('load', () => {
        const resizedDataUri = resizeImage(thumbnail, 300);
        //console.log(resizedDataUri);
        setThumbnail(resizedDataUri);
      });
      thumbnail.src = reader.result;
    }
    
    if (file !== undefined) reader.readAsDataURL(file);
  }

  return (
    <div className="file-upload-container">
      <img src={UploadIcon} class="uploadIcon" alt="Upload Icon"></img>
      <p>Upload your meal image here. Only accept image files. Max file size 5mb</p>
      <button
        type="button"
        class="chooseFileButton"
        onClick={() => {
          document.getElementById('fileInput').click();
        }}
      >
        Choose Image
      </button>
      <form id="fileform">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange = {handleOnChange}
        />
      </form>
      {picture !== undefined ?
        <div className="preview-container">
          <div className="upload-picture-container">
            <span className="delete-button">
              <IconButton aria-label="delete" className="delete-button" onClick={handleDelete}>
                <CancelIcon style={{ color: red[500] }}/>
              </IconButton>
            </span>
            <img className="uploadPicture" src={picture} alt="preview" />
          </div>
        </div>
        : ''}
      
    </div>
  );
}

UplaodImage.propTypes = {
  picture: PropTypes.string,
  setPicture: PropTypes.func,
  setThumbnail: PropTypes.func,
};