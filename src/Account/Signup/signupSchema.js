import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  pass: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  email: Yup.string().email().required("Email is required"),
});

export default SignUpSchema;
