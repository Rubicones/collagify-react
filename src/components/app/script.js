let buttons = document.getElementsByClassName("button");
let arr = [...buttons];

arr.forEach((element, index) => {
  element.addEventListener("click", () => {
    element.style.opacity = "0.56";
 
    arr
      .filter(function (item) {
        return item != element;
      })
      .forEach((item) => {
        item.style.opacity = "0";
      });
  });
});


let rowInput = document.querySelector("#rangeRows")
let colInput = document.querySelector("#rangeCols")
let table = document.querySelector(".preview-table")
let box = document.querySelector(".preview-grid")


const sizeChange = () => {
  let rows = +rowInput.value
  let cols = +colInput.value

  box.innerHTML = ""
  document.querySelector(".rows_choose .counter").innerHTML = rows
  document.querySelector(".cols_choose .counter").innerHTML = cols
  box.style.gridTemplateRows = `repeat(${rows}, 1fr)`
  if (rows * cols == 0)
    return ;
  for (let i = 0; i < rows * cols; i++){
    let newSquare = document.createElement("div") 
    newSquare.classList += "square"
    newSquare.style.width = (750 / (cols > rows ? cols : rows)) + "px"
    newSquare.style.height = (750 / (cols > rows ? cols : rows)) + "px"
    box.appendChild(newSquare)
  }
}


document.querySelector(".rows_choose .counter").innerHTML = rowInput.value
document.querySelector(".cols_choose .counter").innerHTML = colInput.value

rowInput.addEventListener("input", sizeChange)
colInput.addEventListener("input", sizeChange)

sizeChange()
