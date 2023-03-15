import { useEffect, useState } from "react";
import "./Preview.css";
import {ReactComponent as Spinner} from "../../img/spinner.svg"

function findDominant(imageUrl) {
  return new Promise((resolve, reject) => {
    // Load the image from the given URL
    let img = new Image();
    img.crossOrigin = "anonymous"; // Set the crossOrigin attribute to "anonymous"
    img.src = imageUrl;

    // Wait for the image to load before processing it
    img.onload = function() {
      // Create a canvas element and draw the image on it
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      // Get the image data from the canvas
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let pixels = imageData.data;

      // Loop through the pixels and count the occurrences of each color
      let colorCounts = {};
      for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i+1];
        let b = pixels[i+2];
        let color = rgbToHex(r, g, b);
        if (color in colorCounts) {
          colorCounts[color]++;
        } else {
          colorCounts[color] = 1;
        }
      }

      // Find the color with the highest occurrence count
      let dominantColor = null;
      let maxCount = 0;
      for (let color in colorCounts) {
        if (colorCounts[color] > maxCount) {
          dominantColor = color;
          maxCount = colorCounts[color];
        }
      }

      // Resolve with the dominant color as a hex value
      resolve(dominantColor);
    };

    // Reject the promise if the image fails to load
    img.onerror = function() {
      reject(new Error("Failed to load image from URL"));
    };
  });
    // Utility function to convert RGB to hex
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  
  // Utility function to convert a component to a two-digit hex value
  function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}

function Preview(props) {
  const [squares, setSquares] = useState([]);
  const [loading, setLoading] = useState(false)

  const newCanvas = () => {
    setLoading(true)
    const canvas = document.createElement('canvas');
  
    const width = 4000 / (props.cols > props.rows ? props.cols : props.rows);
    canvas.width = width * props.cols;
    canvas.height = width * props.rows;
  
    const ctx = canvas.getContext('2d');
  
    const images = props.albums.map((album) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          findDominant(album).then((dominantColor) => {
            resolve({ img, dominantColor });
          }).catch(() => {
            resolve({ img, dominantColor: "#000000" }); // default to black if dominant color cannot be found
          });
        };
        img.onerror = () => {
          resolve({ img, dominantColor: "#000000" }); // default to black if image fails to load
        };
        img.crossOrigin = "anonymous";
        img.src = album;
      });
    });
  
    Promise.all(images).then((results) => {
      const sortedResults = results.sort((a, b) => {
        const aBrightness = calculateBrightness(a.dominantColor);
        const bBrightness = calculateBrightness(b.dominantColor);
        return bBrightness - aBrightness;
      });
      let x = 0;
      let y = 0;
      sortedResults.forEach(({ img }, i) => {
        ctx.drawImage(img, x, y, width, width);
        x += width;
        if ((i + 1) % props.cols === 0) {
          x = 0;
          y += width;
        }
      });
  
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setLoading(false)
    }).catch((error) => {
      console.error(error);
      setLoading(false)
    });
  };
  
  // utility function to calculate the brightness of a color
  function calculateBrightness(color) {
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }


  useEffect(() => {
    setSquares([]);
    let rows = props.rows;
    let cols = props.cols;

    if (rows * cols === 0) {
      return;
    }

    let newSquares = [];
    for (let i = 0; i < rows * cols; i++) {
      let styles = {
        width: (60 / (cols > rows ? cols : rows)) + "vw",
        height: (60 / (cols > rows ? cols : rows)) + "vw",
        backgroundImage: `url(${props.albums.length > 0 ? props.albums[i] : ""})`
      }
      let newSquare = <div key={i} className="square" style={styles}></div>;
      newSquares.push(newSquare);
    }
    setSquares(newSquares);
  }, [props.rows, props.cols, props.albums]);

  return (
    <section className="preview-section" onClick={newCanvas}>
      <div className="preview-header">Will look like this:</div>
      <div className="preview-grid" style={{ gridTemplateRows: `repeat(${props.rows}, 1fr)` }}>
        {squares}
      </div>
      {loading ? <Spinner/> : null}
      <div className="preview-header">Tap at the collage to create and download a collagified version</div>

    </section>
    
  );
}

export default Preview;


// function findDominant(imageUrl) {
//   return new Promise((resolve, reject) => {
//     // Load the image from the given URL
//     let img = new Image();
//     img.crossOrigin = "anonymous"; // Set the crossOrigin attribute to "anonymous"
//     img.src = imageUrl;

//     // Wait for the image to load before processing it
//     img.onload = function() {
//       // Create a canvas element and draw the image on it
//       let canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       let ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);

//       // Get the image data from the canvas
//       let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       let pixels = imageData.data;

//       // Convert RGB values to HSL values
//       let hslPixels = [];
//       for (let i = 0; i < pixels.length; i += 4) {
//         let r = pixels[i];
//         let g = pixels[i+1];
//         let b = pixels[i+2];
//         let hsl = rgbToHsl(r, g, b);
//         hslPixels.push(hsl);
//       }

//       // Use k-means clustering to group similar colors together
//       let clusters = kMeansClustering(hslPixels);

//       // Compute the weighted counts of each cluster
//       let clusterCounts = {};
//       for (let i = 0; i < clusters.length; i++) {
//         let cluster = clusters[i];
//         let weight = cluster.saturation * cluster.lightness;
//         let count = cluster.pixels.length;
//         for (let j = 0; j < count; j++) {
//           let color = hslToHex(cluster.pixels[j]);
//           if (color in clusterCounts) {
//             clusterCounts[color] += weight;
//           } else {
//             clusterCounts[color] = weight;
//           }
//         }
//       }

//       // Find the color with the highest weighted count
//       let dominantColor = null;
//       let maxCount = 0;
//       for (let color in clusterCounts) {
//         if (clusterCounts[color] > maxCount) {
//           dominantColor = color;
//           maxCount = clusterCounts[color];
//         }
//       }

//       // Resolve with the dominant color as a hex value
//       resolve(dominantColor);
//     };

//     // Reject the promise if the image fails to load
//     img.onerror = function() {
//       reject(new Error("Failed to load image from URL"));
//     };
//   });
// }
