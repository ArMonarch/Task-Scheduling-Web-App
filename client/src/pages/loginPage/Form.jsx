import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { setAuthLogin } from "../../state/authReducer";
import { setUserLogin } from "../../state/userReducer";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Required"),
  password: yup.string().required("Required"),
});

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = () => {
  //dispatch function for login functionality
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      if (loggedIn.msg === "User Does Not Exist") {
        navigate("/auth/register");
        alert(loggedIn.msg + " or Invalid Email/Username");
      }
      else if (loggedIn.msg === "Invalid Credentials"){
        alert(loggedIn.msg);
      }
      else {
        dispatch(
          setAuthLogin({
            token: loggedIn.token,
            user: loggedIn.user,
          })
        );
        dispatch(
          setUserLogin({
            user:loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/app");
      }
    }
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValueLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, minmax(0,1fr))"
            gap={1}
            sx={{
              mx: 0.5,
              padding: 1,
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 2" }}
            />
            <Box gridColumn="span 2">
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  m: "1rem 0",
                  p: "0.5em",
                }}
              >
                Sign In
              </Button>
              <Typography
                sx={{
                  gridColumn: "span 2",
                  textAlign: "center",
                }}
              >
                Don't have an account? <Link to="/auth/register">Sign Up </Link>
                here.
              </Typography>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
