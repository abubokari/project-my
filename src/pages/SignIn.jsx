import React, { useEffect, useState } from "react";
import Buttons from "@mui/material/Button";
import { Button } from "semantic-ui-react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomImage from "../components/Image";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../slices/userAuthenticationSlice";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";

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

export default function SignIn() {
  const [inputField, setInputField] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const sessionDate = Math.round(Date.now() / 1000);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUserInfo.userInfo !== "logout") {
      if (authUserInfo.userInfo.expireDate > sessionDate) {
        navigate("/");
      }
    }
  }, []);

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
  };

  const notify = () =>
    toast.success("Login successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleLogin = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...inputField, secretKey: "WUsI$&mIlhdCI6" },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("email" in response.data.error) {
            setErr((prev) => ({ ...prev, email: response.data.error.email }));
          } else if ("password" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              password: response.data.error.password,
            }));
          } else if ("message" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              message: response.data.error.message,
            }));
          }
        } else if ("success" in response.data) {
          setLoading(true);
          let userData = JSON.stringify({
            email: response.data.token.email,
            expireDate: response.data.token.exp,
            role: response.data.role,
            id: response.data.userId,
            course: response.data.course,
          });

          dispatch(
            activeUser({
              email: response.data.token.email,
              expireDate: response.data.token.exp,
              role: response.data.role,
              id: response.data.userId,
              course: response.data.course,
            })
          );

          localStorage.setItem("user", userData);
          notify();

          setTimeout(() => {
            setLoading(false);
            navigate("/");
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" className="custom-margin-two" maxWidth="sm">
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
            Sign In
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={inputField.email}
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
                  onChange={handleChange}
                  value={inputField.password}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                {err && err.password ? (
                  <Alert severity="error" className="errorMsg">
                    {err.password}
                  </Alert>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>

            {loading ? (
              <Button loading primary className="loading-btn">
                Loading
              </Button>
            ) : (
              <Buttons
                onClick={handleLogin}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Buttons>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
