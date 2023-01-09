import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  pass: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  email: Yup.string().email().required("Email is required"),
});

export default LoginSchema;
