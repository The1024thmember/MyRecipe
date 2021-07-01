import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default function WarningDialog(props) {
  const handleNo = () => {
    props.setWarning(false);
    props.setWarningFeedback('no');
  }

  const handleYes = () => {
    props.setWarning(false);
    props.setWarningFeedback('yes');
  }

  return (
    <div>
      <Dialog onClose={handleNo} open={props.open}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          {props.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes} color="primary">
            Yes
          </Button>
          <Button onClick={handleNo} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}