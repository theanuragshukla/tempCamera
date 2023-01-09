class CameraLogic {
  constructor() {}
  destroy = () => {
    if (!this.stream) {
      console.log("stream", this.stream);
      return;
    }
    const tracks = this.stream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      track.stop();
    }
    this.video.srcObject = null;
  };
  getVideo = (constraints, videoRef, setImgSz) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = videoRef.current;
        this.video = video;
        this.stream = stream;
        video.srcObject = stream;
        video.addEventListener("playing", () => {
          setImgSz((obj) => {
            obj.width = video.videoWidth;
            obj.height = video.videoHeight;
            return obj;
          });
        });
      })
      .catch((err) => {
        console.log(err.name);
        if (err.name == "OverconstrainedError") {
          alert(
            "device not supported! please switch to a mobile device to use this feature"
          );
        }
      });
  };

  stopVideo = (videoRef) => {
    let video = videoRef.current;
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      track.stop();
    }

    video.srcObject = null;
  };
  paintToCanvas = (videoRef, photoRef, imgSz, captured) => {
    if (!captured) {
      let video = videoRef.current;
      let photo = photoRef.current;
      let ctx = photo.getContext("2d");
      return setInterval(() => {
        const width = imgSz.width;
        const height = imgSz.height;
        photo.width = width;
        photo.height = height;
        ctx.drawImage(video, 0, 0, width, height);
      }, 200);
    }
  };

  takePhoto = (photoRef, videoRef, setImg, setCaptured) => {
    let photo = photoRef.current;
    const data = photo.toDataURL("image/jpeg");
    setImg(data);
    this.stopVideo(videoRef);
    setCaptured(() => {
      return true;
    });
  };
}

export default CameraLogic;
