//A modal page whenever user clicks on share btn this modal will be displayed with the link of the doc to share
import CancelIcon from "@mui/icons-material/Cancel";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function Modal({ isOpen, onClose, urlToShare }) {
  //use state if copySuccess = true than  "copied text will be displayed for a sec or 2"
  const [copySuccess, setCopySuccess] = useState(false);
  //to copy the url required to share
  const handleCopyLink = () => {
    console.log(urlToShare);
    //As soon as user clicks icon this func is called and content is copied on the clipboard
    navigator.clipboard.writeText(urlToShare).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  //if a user clicks on the link instead of copy icon he will be taken to a new window on that link
  const handleOpenLink = () => {
    window.open(urlToShare);
  };
  return (
    <div>
      {/* This is basic modal from mui when modal is closed we will pass onclose ie it will be closed  */}
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle style={{ fontWeight: "bold" }}>
          Share Options
          <IconButton
            color="primary"
            onClick={onClose}
            style={{ float: "right" }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {"Share Link: "}
          <Typography
            variant="body1"
            color="primary"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontFamily: "Ariel",
            }}
            onClick={handleOpenLink}
          >
            {urlToShare}
          </Typography>
          <IconButton color="primary" onClick={handleCopyLink}>
            <FileCopyIcon />
          </IconButton>
          {copySuccess && (
            <span style={{ marginLeft: "10px", color: "green" }}>Copied!</span>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Modal;
