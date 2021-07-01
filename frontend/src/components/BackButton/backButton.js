import React from 'react';
import { useHistory } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '@material-ui/core/Button';
import 'styles/components/backButtonStyles.css';

export default function BackButton () {
  const history = useHistory();
  const handleBackButton = () => {
    history.goBack();
  }
  return (
    <div className="button-container">
      <Button
        variant="outlined"
        color="primary"
        startIcon={<KeyboardBackspaceIcon />}
        onClick={handleBackButton}
      >
        Back
      </Button>
    </div>
  );
}