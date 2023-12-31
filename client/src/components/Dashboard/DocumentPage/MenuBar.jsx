import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const MenuBar = () => {
  console.log("hurray");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [docName, setDocName] = useState("");

  const handleDocName = () => {
    console.log("save as");
    const document_name = prompt("Enter doc name ");
    setDocName(document_name);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleSave = () => {
    console.log("Save clicked");
    // Add logic for saving the document
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (option) => {
    setDocName(option);
    handleMenuClose();
  };

  return (
    <>
      <Toolbar>
        {/* Google Doc icon with text */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
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
              style={{ fontSize: "16px", marginLeft: "2px", padding: 0 }}
            >
              Google Doc
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
                onClick={handleMenuOpen}
              >
                File
              </Button>
              <Menu
                id="file-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuItemClick("New Document")}>
                  New Document
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Save")}>
                  Save
                </MenuItem>
                <MenuItem onClick={handleDocName}>Save As</MenuItem>
                {/* Add more File options as needed */}
              </Menu>

              {/* Edit menu */}
              <Button
                color="inherit"
                aria-controls="edit-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Edit
              </Button>
              <Menu
                id="edit-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                {/* Add Edit menu options as needed */}
              </Menu>

              <Button
                color="inherit"
                aria-controls="view-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                View
              </Button>

              <Button
                color="inherit"
                aria-controls="insert-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Insert
              </Button>

              <Button
                color="inherit"
                aria-controls="format-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Format
              </Button>

              <Button
                color="inherit"
                aria-controls="help-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Help
              </Button>
            </div>
          </div>
        </div>
      </Toolbar>
    </>
  );
};

export default MenuBar;
