
const Square = () => {
	return <div className="square"></div>
}

const Gallery = () => {
  return (
	  <div className="super">
	  [1,2,3,4,5,6,7,8,9,10].map(<Square/>)
	  </div>
  );
};

export default Gallery;
