import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Camera.css";
import CameraLogic from "./cameraLogic";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { Alert, Box, IconButton, Snackbar } from "@mui/material";
const Camera = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [img, setImg] = useState("");
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({
    msg: "",
    type: "info",
  });
  const [captured, setCaptured] = useState(false);
  const [imgSz, setImgSz] = useState({
    width: 0,
    height: 0,
  });
  const constraints = {
    video: {
      width: {
        min: 1280,
        ideal: window.innerWidth,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: window.innerHeight,
        max: 1440,
      },
      facingMode: {
        //  exact: 'environment'
      },
    },
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const logic = useMemo(() => new CameraLogic(), []);
  const loginStatus = useSelector((state) => state.login.status);
  useEffect(() => {
    if (loginStatus) logic.getVideo(constraints, videoRef, setImgSz);
    return () => logic.destroy();
  }, [loginStatus, videoRef]);

  const cancelUpload = () => {
    setCaptured(false);
    setImg("");
    logic.getVideo(constraints, videoRef, setImgSz);
  };
  const showToast = ({ msg, type }) => {
    setToast((state) => {
      state.msg = msg;
      state.type = type;
      return state;
    });
    setOpen(true);
  };

  const uploadImg = () => {
    fetch("http://localhost:5000/upload-image", {
      method: "POST",
      crossdomain: true,
      withCredentials: true,
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img: img.toString(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          showToast({ msg: "Image uploaded successfully!", type: "success" });
          cancelUpload();
        } else {
          alert("some eror occoured");
        }
      });
  };
  return (
    <div className="container">
      {!captured ? (
        <div className="videoWrapper">
          <video
            onCanPlay={() =>
              logic.paintToCanvas(videoRef, photoRef, imgSz, captured)
            }
            ref={videoRef}
            className="player"
            autoPlay
          />
          <canvas ref={photoRef} className="photo" />
          <div className="btnGroup">
            <IconButton
              sx={{
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#fff", color: "secondary.main" },
              }}
              onClick={() =>
                logic.takePhoto(photoRef, videoRef, setImg, setCaptured)
              }
            >
              <PhotoCameraIcon style={{ fontSize: 40 }} />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="imgWrapper">
          <img src={img} className="img" alt="binImage" />
          <div className="btnGroup">
            <IconButton
              sx={{
                bgcolor: "error.main",
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: "error.main" },
              }}
              onClick={() => {
                cancelUpload();
                showToast({ msg: "Image discarded!", type: "error" });
              }}
            >
              <CancelIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: "success.main",
                color: "#fff",
                "&:hover": { bgcolor: "#fff", color: "success.main" },
              }}
              onClick={() => {
                showToast({ msg: "uploading...", type: "info" });
                uploadImg();
              }}
            >
              <DoneIcon style={{ fontSize: 40 }} />
            </IconButton>
          </div>
        </div>
      )}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Camera;
