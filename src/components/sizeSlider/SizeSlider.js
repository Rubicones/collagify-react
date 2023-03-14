import { useEffect, useState } from "react";
import "./SizeSlider.css"

function SizeSlider({onSizeChange, rows, columns, header, total}) {
  const [counter, setCounter] = useState(Math.floor(Math.sqrt(total)))
  let max = counter**2

  const setNewValue = (e) => {
    onSizeChange(e.target.value)
    setCounter(e.target.value)
  }
  
  header == "Rows" ? max = Math.floor(total / columns) : max = Math.floor(total / rows)

  useEffect(() => {
    setCounter(1)
    max = total
  }, [total])
  

  return (
    <div className="rows_choose">
      <label htmlFor="rangeRows" className="form-label">
        {header}
      </label>
      <div className="inputCont">
        <input type="range" className="form-range" min="0" max={max} id="rangeRows" value={counter} onInput={setNewValue} />
        <div className="max">Max: {max}</div>
      </div> 
      <div className="counter">{counter}</div>
    </div>
  );
}

export default SizeSlider