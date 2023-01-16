import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ImgGridItem from "./ImgGridItem";
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
        const obj = {
          uid: uid,
          img: res.img,
        };
        setImgs((arr) => {
          arr = [...arr, obj];
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
      {allImages && allImages.map((item) => <ImgGridItem item={item} />)}
    </Grid>
  );
};

export default Dashboard;
