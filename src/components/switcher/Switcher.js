import { useEffect, useState } from "react";
import "./Switcher.css";

function FavArtist(props) {
  return (
    <>
      <input onClick={() => {props.onSelect(1)}} className="button" type="radio" name="toggle" id="one" style={props.isActive ? {"opacity": "0.56"} : {"opacity": "0"}}/>
        <div className="input-value" id="fav-artist">
          Favorite Artist
        </div>  
    </>
  )
}

function FavPlaylist(props) {
  return (
    <>
    <input onClick={() => {props.onSelect(2)}} className="button" type="radio" name="toggle" id="two" style={props.isActive ? {"opacity": "0.56"} : {"opacity": "0"}}/>
      <div className="input-value" id="fav-playlist">
        Favorite Playlist
      </div>
  </>
  )
 
}

function WholeLib(props) {
  return(
    <>
      <input onClick={() => {props.onSelect(3)}} className="button" type="radio" name="toggle" id="three" style={props.isActive ? {"opacity": "0.56"} : {"opacity": "0"}}/>
        <div className="input-value" id="whole-lib">
          Whole Library
        </div>
    </>
  )
}


function Switcher(props) {
  const [active, setActive] = useState(2)

  const onSelect = (id) => {
    setActive(id); 
    props.onSwitch(active)
  }

  useEffect(() => {
    props.onSwitch(active)
  }, [active])

  return (
    <div className="tri-state-toggle">
      <FavArtist isActive={active === 1 ? true : false} onSelect={onSelect}/>
      <FavPlaylist isActive={active === 2 ? true : false} onSelect={onSelect}/>
      <WholeLib isActive={active === 3 ? true : false} onSelect={onSelect}/>
    </div>
  );
}

export default Switcher;
