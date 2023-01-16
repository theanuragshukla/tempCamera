import { MoreHorizRounded, Save, ShareRounded } from "@mui/icons-material";
import "./square.css";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  ImageListItem,
  ImageListItemBar,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import { useRef, useState } from "react";
import { useTheme } from "@emotion/react";
const ImgGridItem = ({ item }) => {
  const theme = useTheme();
  const [showTools, setShowTools] = useState(false);
  const imgRef = useRef(null);
  const handleMenuClick = () => {
    setMenuAnchor(imgRef.current);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const actions = [
    { icon: <Save />, name: "Save" },
    { icon: <ShareRounded />, name: "Share" },
  ];
  return item ? (
    <Grid key={item.uid} item xs={4} sx={{}}>
      <div className="square"></div>
      {
        //<ImageListItem
        //sx={{
        //width: "100%",
        //}}
        //key={item.uid}
        //>
        //<ImageListItemBar
        //sx={{
        //background:
        //"linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
        //"rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
        //}}
        //position="top"
        //actionIcon={
        //<SpeedDial
        //ariaLabel="SpeedDial basic example"
        //direction="left"
        //position="absolute"
        //top={0}
        //right={0}
        //sx={{
        //"& .MuiFab-primary": {
        //bgcolor: "transparent",
        //height: 40,
        //width: 40,
        //"&:hover": { backgroundColor: "transparent" },
        //},
        //}}
        //icon={<MoreHorizRounded />}
        //>
        //{actions.map((action) => (
        //<SpeedDialAction
        //key={action.name}
        //icon={action.icon}
        //tooltipTitle={action.name}
        //sx={{
        //backgroundColor: "transparent",
        //color: "#fff",
        //width: 40,
        //height: 40,
        //"&:hover": { bgcolor: "transparent" },
        //}}
        ///>
        //))}
        //</SpeedDial>
        //}
        ///>
        //</ImageListItem>
      }
    </Grid>
  ) : (
    <></>
  );
};

export default ImgGridItem;

{
  //<IconButton sx={{ color: "white" }}>
  //<StarBorderRounded />
  //</IconButton>
  //<IconButton sx={{ color: "white" }} onClick={handleMenuClick}>
  //<MoreHorizRounded ref={imgRef} />
  //</IconButton>
  //{imgRef.current && menuAnchor && (
  //<Menu
  //anchorEl={menuAnchor}
  //keepMounted
  //open={Boolean(menuAnchor)}
  //onClose={handleMenuClose}
  //>
  //<MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
  //<MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
  //<MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
  //</Menu>
  //)}
}
