import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import React from "react";
import Modal from "react-modal";
function Summary({ isOpen, onClose, summary }) {
  const handleCopyLink = () => {
    console.log(summary);
    //As soon as user clicks icon this func is called and content is copied on the clipboard
    navigator.clipboard.writeText(summary).then(() => {
      console.log("copied");
    });
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Summary Modal"
        style={{
          content: {
            width: "50%",
            height: "60%",
            margin: "auto",
            overflow: "hidden",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <IconButton
          color="primary"
          onClick={onClose}
          style={{ float: "right", marginTop: "-1rem", marginRight: "-1rem" }}
        >
          <CancelIcon />
        </IconButton>

        <div
          style={{
            marginTop: "2rem",
            height: "18rem",
            overflowY: "auto",
          }}
        >
          <textarea
            readOnly
            value={summary}
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",  
            }}
          />
        </div>
        <IconButton
          color="primary"
          onClick={handleCopyLink}
          style={{ float: "right" }}
        >
          <FileCopyIcon />
        </IconButton>
      </Modal>
    </div>
  );
}

export default Summary;
