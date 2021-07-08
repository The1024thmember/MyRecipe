import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'styles/components/uploadImage.css';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';

import UploadIcon from 'assets/img/outbox.png';
import HostUrl from 'config';

export default function UplaodImageFile ({ picture, setPicture, existingImage, setExistingImage }) {
  const [preview, setPreview] = useState(existingImage);
  const handleDelete = () => {
    setPicture(undefined);
    setPreview('');
    setExistingImage(null);
    document.getElementById("fileform").reset();
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
    }
    // console.log("changing images");
    reader.onloadend = () => {
      // Set the original image to "preview" variable
      setPreview(reader.result);

    }

    if (file !== undefined) reader.readAsDataURL(file);
  }

  // console.log("Picture", picture);
  // console.log("Existing", existingImage);
  // console.log("Preview", preview);

  return (
    <div className="file-upload-container">
      <img src={UploadIcon} className="uploadIcon" alt="Upload Icon"></img>
      <p>Upload your meal image here. Only accept image files. Max file size 5mb</p>
      <button
        type="button"
        className="chooseFileButton"
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
      {picture !== undefined || existingImage !== null ?
        <div className="preview-container">
          <div className="upload-picture-container">
            <span className="delete-button">
              <IconButton aria-label="delete" className="delete-button" onClick={handleDelete}>
                <CancelIcon style={{ color: red[500] }}/>
              </IconButton>
            </span>
            {picture !== undefined ? <img className="uploadPicture" src={preview} alt="preview" />
            : <img className="uploadPicture" src={HostUrl('/' + existingImage)} alt="preview" />}
            
          </div>
        </div>
        : ''}
      
    </div>
  );
}

UplaodImageFile.propTypes = {
  picture: PropTypes.object,
  setPicture: PropTypes.func,
  existingImage: PropTypes.string,
  setExistingImage: PropTypes.func,
};