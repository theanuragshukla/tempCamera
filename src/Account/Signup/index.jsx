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
import { checkAll } from "../../utils.js";
import { useDispatch } from "react-redux";
import { updateLogin } from "../../store/loginSlice.js";
import SignUpSchema from "./signupSchema.js";
import { Formik } from "formik";
import InputField from "../Input";
const SignUpForm = ({ setPos }) => {
  const dispatch = useDispatch();
  const signup = async (data) => {
    if (checkAll(data)) {
      fetch("http://localhost:5000/signup", {
        method: "POST",
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
    } else {
      alert("error");
    }
  };
  const initialValues = {
    name: "",
    email: "",
    pass: "",
  };

  const handleSubmit = (values) => {
    signup(values);
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
          Sign Up
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            const { handleSubmit, dirty, isValid } = formik;
            return (
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <InputField label="Full Name" name="name" formik={formik} />

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
                  variant="contained"
                  disabled={!(dirty && isValid)}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item>
                    <Link
                      onClick={() => {
                        setPos(0);
                      }}
                      variant="body2"
                    >
                      {"Already have an account? Login"}
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

export default SignUpForm;
