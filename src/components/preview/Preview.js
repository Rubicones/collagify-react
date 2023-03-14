import { useEffect, useState } from "react";
import "./Preview.css";


function Preview(props) {
  const [squares, setSquares] = useState([])

  useEffect(() => {
    setSquares([])
    let rows = props.rows
    let cols = props.cols

    if (rows * cols === 0)
      return ;
    for (let i = 0; i < rows * cols; i++){
      let styles = {
        width: (750 / (cols > rows ? cols : rows)) + "px",
        height: (750 / (cols > rows ? cols : rows)) + "px",
        backgroundImage: `url(${props.albums.length > 0 ? props.albums[i] : ""})`
      }
      let newSquare = 
      <div key={i} className="square" style={styles}>
      </div>
      setSquares(oldSquares => [...oldSquares, newSquare])
    }

  }, [props.rows, props.cols, props.albums])

  return (
    <section className="preview-section">
      <div className="preview-header">Will look like this:</div>
      <div className="preview-grid" style={{gridTemplateRows: `repeat(${props.rows}, 1fr)`}}>
        {squares}
      </div>
    </section>
  );
}

export default Preview;
