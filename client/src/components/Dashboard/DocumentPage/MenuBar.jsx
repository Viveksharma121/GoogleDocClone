import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Summary from "./Summary/Summary";
const MenuBar = ({ QuillData }) => {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  let value = QuillData;
  // Assuming value is an HTML string
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = value;

  const textContent = tempDiv.textContent || tempDiv.innerText;
  console.log(textContent.trim());
  value = textContent.trim();

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [docName, setDocName] = useState("");
  const docId1 = useParams();
  const docId = docId1.docId;

  useEffect(() => {
    const fetchData = async () => {
      console.log(docId);
      try {
        const response = await axios.get(`${BackendUrl}doc-name`, {
          params: { docId },
        });
        console.log(response);
        setDocName(response.data.docName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [docId]);

  const [isSummarymodelOpen, setisSummarymodelOpen] = useState(false);
  const [summaryValue, setSummaryValue] = useState("");
  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
  };

  const handleDocName = async () => {
    console.log("save as");
    const document_name = prompt("Enter doc name ");
    console.log(document_name);
    const response = await axios.post(`${BackendUrl}doc-name`, {
      docId: docId,
      docName: document_name,
    });
    console.log(response.data.message.docName);
    setDocName(response.data.message.docName);
    handleFileMenuClose();
  };

  const handleFileMenuOpen = (event) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  const handleSave = () => {
    console.log(docName);
    handleFileMenuClose();
  };

  const handleMenuItemClick = (option) => {
    console.log(`Clicked ${option}`);
    handleFileMenuClose();
  };
  //summary
  const handleSummarize = async () => {
    try {
      const response = await axios.post(`${BackendUrl}summarize`, {
        content: value,
      });
      setSummary(response.data.summary);
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // State to manage the summary and modal visibility
  const [summary, setSummary] = useState("");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  return (
    <>
      <Summary
        isOpen={isSummaryModalOpen}
        onClose={handleCloseSummaryModal}
        summary={summary}
      />
      <Toolbar>
        {/* Google Doc icon with text */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={handleFileMenuOpen}
            style={{ padding: "0" }}
          >
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/google-docs--v1.png"
              alt="google-docs--v1"
            />
          </IconButton>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "4px",
            }}
          >
            <Typography
              variant="caption"
              style={{ fontSize: "17px", marginLeft: "5px", padding: 0 }}
            >
              {docName === null ? "Google Doc" : docName}
            </Typography>

            {/* Menu options */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "-10px",
                height: "18px",
              }}
            >
              <Button
                color="inherit"
                aria-controls="file-menu"
                aria-haspopup="true"
                onClick={handleFileMenuOpen}
              >
                File
              </Button>
              <Menu
                id="file-menu"
                anchorEl={fileMenuAnchor}
                keepMounted
                open={Boolean(fileMenuAnchor)}
                onClose={handleFileMenuClose}
              >
                <MenuItem onClick={() => handleMenuItemClick("New Document")}>
                  New Document
                </MenuItem>
                <MenuItem onClick={handleSave}>Save</MenuItem>
                <MenuItem onClick={handleDocName}>Save As</MenuItem>
                {/* Add more File options as needed */}
              </Menu>

              {/* Edit menu */}
              <Button
                color="inherit"
                aria-controls="edit-menu"
                aria-haspopup="true" // Implement Edit menu functions
              >
                Edit
              </Button>
              <Button
                color="inherit"
                aria-controls="edit-menu"
                aria-haspopup="true" // Implement Edit menu functions
                onClick={handleSummarize}
              >
                Summarise
              </Button>
              {/* Add other menu buttons similarly */}
              {/* <Modal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
              >
                <div>
                  <h2>Document Summary</h2>
                  <p>{summary}</p>
                </div>
              </Modal> */}
            </div>
          </div>
        </div>
      </Toolbar>
    </>
  );
};

export default MenuBar;
