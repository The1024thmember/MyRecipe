import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function SimpleDialog(props) {
  const handleClose = () => {
    props.setError(false);
  }

  return (
    <div>
      <Dialog onClose={handleClose} open={props.open}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          {props.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}