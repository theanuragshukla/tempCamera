import { useEffect, useState } from "react";
import LoginForm from "./Login";
import SignUpForm from "./Signup";
import DashBoard from "./Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { updateLogin } from "../store/loginSlice";
const Account = () => {
  const [pos, setPos] = useState(0);
  const loginStatus = useSelector((state) => state.login.status);
  const dispatch = useDispatch();
  useEffect(() => {
    const verify = async () => {
      await fetch("http://localhost:5000/checkAuth", {
        method: "GET",
        crossdomain: true,
        withCredentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result) {
            dispatch(updateLogin(true));
            console.log(res);
          }
        });
    };
    verify();
  }, []);
  return (
    <>
      {!loginStatus ? (
        pos == 0 ? (
          <LoginForm setPos={setPos} />
        ) : (
          <SignUpForm setPos={setPos} />
        )
      ) : (
        <DashBoard />
      )}
    </>
  );
};

export default Account;
