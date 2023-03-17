import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [userLogin, setUserLogin] = useState({
    username: "",
    password: "",
  });

  const [Loader, setLoader] = useState(false)

  const history = useHistory()

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserLogin({ ...userLogin, [name]: value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (validateInput(userLogin)) {
      setLoader(true);
      await login(userLogin)
      setLoader(false)
    }
    else{

    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    try {
      const response = await axios.post(`${config.endpoint}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      //push data to local storage
      var user = {
        "username" : response.data.username,
        "token" : response.data.token,
        "balance" : response.data.balance
      }
      persistLogin(user.token, user.username, user.balance);
      
      history.push("/", {from :"Login"})
    } catch (err) {
      if (err.response === undefined)
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      else if (err.response.status === 400)
        enqueueSnackbar(`${err.response.data.message}`, {
          variant: "error",
        });
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    var flag = false;
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return flag;
    
    } else if (data.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return flag;
  
    } else {
      return true;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("balance", balance)

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="username"
            variant="outlined"
            title="username"
            name="username"
            placeholder="Enter Username"
            value={userLogin.username}
            onChange={handleInput}
            fullWidth
          />
          <TextField
            id="password"
            label="password"
            variant="outlined"
            title="password"
            name="password"
            placeholder="Enter Password"
            value={userLogin.password}
            onChange={handleInput}
            fullWidth
          />
          {!Loader && <Button
            className="button"
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            LOGIN TO QKART
          </Button>}
          {Loader && 
          <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" />
        </div>}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
