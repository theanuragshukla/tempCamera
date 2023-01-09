import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import { updateLogin } from "../../store/loginSlice";
import InputField from "../Input";
import LoginSchema from "./loginScheme";
import { Formik } from "formik";
const LoginForm = ({ setPos }) => {
  const dispatch = useDispatch();
  const login = (data) => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          dispatch(updateLogin(true));
        } else {
          alert(res.msg);
        }
      });
  };

  const submitForm = (values) => {
    login(values);
  };

  const initialValues = {
    email: "",
    pass: "",
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={submitForm}
        >
          {(formik) => {
            const { handleSubmit, dirty, isValid } = formik;
            return (
              <Box onSubmit={handleSubmit} component={"form"} sx={{ mt: 1 }}>
                <InputField
                  label="Email Address"
                  name="email"
                  formik={formik}
                />
                <InputField
                  name="pass"
                  label="Password"
                  type="password"
                  formik={formik}
                />
                <Button
                  type="submit"
                  fullWidth
                  disabled={!(dirty && isValid)}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link
                      onClick={() => {
                        setPos(1);
                      }}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginForm;
