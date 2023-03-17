import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setProcess] = useState(false);
  const [userRegistration, setUserRegistration] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const history = useHistory()

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserRegistration({ ...userRegistration, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateInput(userRegistration)) {
      setProcess(true);

      var body = {
        username: userRegistration.username,
        password: userRegistration.password,
      };

      const url = config.endpoint + "/auth/register";
      axios({
        method: "post",
        url: url,
        data: body,
      })
        .then(function (response) {
          enqueueSnackbar("Registered successfully", { variant: "success" });
          setProcess(false);
          history.push("/login")
        })
        .catch(function (error) {
          console.log(error.response);
          if (error.response === undefined)
            enqueueSnackbar(
              "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
              { variant: "error" }
            );
          else if (error.response.status === 400)
            enqueueSnackbar(`${error.response.data.message}`, {
              variant: "error",
            });
          setProcess(false);
        });
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   *
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {};

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    var flag = false;
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return flag;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return flag;
    } else if (data.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return flag;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return flag;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return flag;
    } else {
      return true;
    }

    /**
     * Validate the input values so that any bad or illegal values are not passed to the backend.
     *
     * @param {{ username: string, password: string, confirmPassword: string }} data
     *  Object with values of username, password and confirm password user entered to register
     *
     * @returns {boolean}
     *    Whether validation has passed or not
     */
  };

  const renderAuthButton = () => {
    if (!isProcessing) {
      return (
        <Button
          className="button"
          variant="contained"
          type="submit"
          onClick={handleSubmit}
          
        >
          Register Now
        </Button>
      );
    } else {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" />
        </div>
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={userRegistration.username}
            onChange={handleInput}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={userRegistration.password}
            onChange={handleInput}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={userRegistration.confirmPassword}
            onChange={handleInput}
          />
          {renderAuthButton()}

          {/* <Button
            className="button"
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            Register Now
          </Button>
          <CircularProgress /> */}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
