import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
// import "./Register.css"

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload();
    history.push("/", {from: "Header"})
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      )}

      {!hasHiddenAuthButtons && !token && (
        <Stack spacing={2} direction="row">
          <Button variant="text" 
          onClick={() => {
            history.push("/login", {from: "Header"})
          }}>
            LOGIN
            </Button>
          <Button variant="contained" className="button" 
          onClick={() => {
            history.push("/register", {from: "Header"})
          }}>
            REGISTER
            </Button>

        </Stack>
      )}
      {
        !hasHiddenAuthButtons && token && (
          <Stack spacing={2} direction="row">
            <Avatar src="avatar.png" alt={username} />
            <p >{username}</p>
          <Button variant="text" className="explore-button"
          onClick={handleLogout}> 
          LOGOUT
            </Button>
        </Stack>
        )
      }
    </Box>
  );
};

export default Header;
