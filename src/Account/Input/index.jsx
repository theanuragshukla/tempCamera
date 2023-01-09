import { TextField } from "@mui/material";

const InputField = ({
  label,
  variant = "outlined",
  required = true,
  name,
  formik,
  type = "text",
}) => {
  const { values, handleChange, errors, touched, handleBlur } = formik;

  return (
    <TextField
      variant={variant}
      margin="normal"
      label={!label ? "" : label}
      required={required ? required : false}
      fullWidth
      name={name && name}
      value={values[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      type={type}
    />
  );
};

export default InputField;
