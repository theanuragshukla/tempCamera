import {
  Grid,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";

import { ShareRounded, DeleteRounded, StarOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const [prof, setProf] = useState({});
  const [allImages, setImgs] = useState([]);
  const fetchImage = async (uid) => {
    console.log(uid);
    await fetch("http://localhost:5000/fetchImage/" + uid, {
      method: "GET",
      crossdomain: true,
      withCredentials: true,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setImgs((arr) => {
          arr = [...arr, res.img];
          return arr;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchImages = () => {
    if (prof.imgs) prof.imgs.map(fetchImage);
  };
  useEffect(() => {
    const getProfile = async () => {
      await fetch("http://localhost:5000/getProfile", {
        method: "GET",
        crossdomain: true,
        withCredentials: true,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            setProf(res.user);
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getProfile();
  }, []);
  useEffect(() => {
    fetchImages();
  }, [prof]);
  return (
    <Grid container>
      {allImages &&
        allImages.map((img) => (
          <Grid
            bgcolor="secondary.main"
            item
            sx={{
              border: "2px solid red",
              overflow: "hidden",
            }}
            xs={6}
            md={4}
          >
            <Card sx={{ height: "100%" }}>
              <CardActionArea>
                <CardMedia component="img" image={img} alt="green iguana" />
              </CardActionArea>
              <CardActions>
                <IconButton>
                  <ShareRounded />
                </IconButton>
                <IconButton>
                  <DeleteRounded />
                </IconButton>
                <IconButton>
                  <StarOutlined />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};
export default Dashboard;
