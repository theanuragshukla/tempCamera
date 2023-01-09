import { AccountCircle, CameraRounded, Image } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import "./App.css";
import Camera from "./Camera";
import Account from "./Account";
import Gallery from "./Gallery";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "./store/cameraSlice";

import { updateLogin } from "./store/loginSlice";

function App() {
  const loginStatus = useSelector((state) => state.login.status);
  const [pos, setPos] = useState(2);
  const dispatch = useDispatch();

  useEffect(() => {
    const verify = async () => {
      await fetch("http://localhost:5000/checkAuth", {
        method: "GET",
        crossdomain: true,
        withCredentials: true,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result) {
            setPos(0);
            dispatch(updateLogin(true));
          } else {
            setPos(2);
            dispatch(updateLogin(false));
          }
        });
    };
    verify();
  }, []);
  useEffect(() => {
    console.log("loginStatus", loginStatus);
    if (!loginStatus) {
      setPos(2);
    } else {
    }
  }, [loginStatus]);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Grid
        container
        sx={{
          height: "100%",
        }}
      >
        {pos == 0 ? <Camera pos={pos} /> : pos == 1 ? <Gallery /> : <Account />}
      </Grid>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 4 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={pos}
          onChange={(event, newValue) => {
            setPos(loginStatus ? newValue : 2);
            dispatch(toggle(pos == 0));
          }}
        >
          <BottomNavigationAction label="Camera" icon={<CameraRounded />} />
          <BottomNavigationAction label="Gallery" icon={<Image />} />
          <BottomNavigationAction label="Profile" icon={<AccountCircle />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;
