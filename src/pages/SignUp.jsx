import React, { useState } from "react";
import Buttons from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomImage from "../components/Image";
import logo from "../assets/images/logo.png";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Creative IT Institute. All right reserved
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [inputField, setInputField] = useState({
    uname: "",
    email: "",
    batchName: "",
    phone: "",
    password: "",
    token: "",
  });
  const [err, setErr] = useState({});
  const navigate = useNavigate();

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
  };

  const notify = () =>
    toast.success("Registration successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/register`,
      headers: {
        "Content-Type": "application/json",
      },
      data: inputField,
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("uname" in response.data.error) {
            setErr((prev) => ({ ...prev, uname: response.data.error.uname }));
          } else if ("email" in response.data.error) {
            setErr((prev) => ({ ...prev, email: response.data.error.email }));
          } else if ("batchName" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              batchName: response.data.error.batchName,
            }));
          } else if ("phone" in response.data.error) {
            setErr((prev) => ({ ...prev, phone: response.data.error.phone }));
          } else if ("password" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              password: response.data.error.password,
            }));
          } else if ("token" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              token: response.data.error.token,
            }));
          } else if ("message" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              message: response.data.error.message,
            }));
          } 
        } else if ("success" in response.data) {
      
          setInputField((prev) => ({
            ...prev,
            uname: "",
            email: "",
            batchName: "",
            phone: "",
            password: "",
            token: "",
          }));

          notify();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        type="success"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container component="main" className="custom-margin" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
          }}
        >
          <CustomImage
            src={logo}
            alt="logo"
            loading="lazy"
            className="main-logo"
          />

          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="uname"
                  label="Student Name"
                  type="text"
                  onChange={handleChange}
                  value={inputField.uname}
                  autoComplete="email"
                />

                {err && err.uname ? (
                  <Alert severity="error" className="errorMsg">
                    {err.uname}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="email"
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  value={inputField.email}
                  autoComplete="email"
                />

                {err && err.email ? (
                  <Alert severity="error" className="errorMsg">
                    {err.email}
                  </Alert>
                ) : err.message ? (
                  <Alert severity="error" className="errorMsg">
                    {err.message}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="batchName"
                  label="Batch Name"
                  type="text"
                  onChange={handleChange}
                  value={inputField.batchName}
                  autoComplete="batchName"
                />

                {err && err.batchName ? (
                  <Alert severity="error" className="errorMsg">
                    {err.batchName}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  type="text"
                  onChange={handleChange}
                  value={inputField.phone}
                  autoComplete="phone"
                />

                {err && err.phone ? (
                  <Alert severity="error" className="errorMsg">
                    {err.phone}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  onChange={handleChange}
                  value={inputField.password}
                  autoComplete="password"
                />

                {err && err.password ? (
                  <Alert severity="error" className="errorMsg">
                    {err.password}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="token"
                  label="Secret Token"
                  type="text"
                  onChange={handleChange}
                  value={inputField.token}
                  autoComplete="token"
                />

                {err && err.token ? (
                  <Alert severity="error" className="errorMsg">
                    {err.token}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>

            <Buttons
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Buttons>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
