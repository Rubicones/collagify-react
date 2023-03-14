import "./App.css";
import Switcher from "../switcher/Switcher";
import CheckList from "../checkList/CheckList";
import SizeSlider from "../sizeSlider/SizeSlider";
import Preview from "../preview/Preview";
import SpotifyService from "../services/SpotifyService";
import { useEffect, useState } from "react";
import spotiLogo from "../../img/spotiLogo.png"

function App() {
  const [blur, setBlur] = useState({"WebkitFilter": "blur(4px)"})
  const [isloginView, setLoginView] = useState(true)
  const [name, setName] = useState("Your Name")
  const [switcher, setSwitcher] = useState("2")
  const [total, setTotal] = useState(400)
  const [rowsCount, setRowsCount] = useState(20)
  const [colsCount, setColsCount] = useState(20)
  const [albums, setAlbums] = useState([])
  let service = new SpotifyService()


  useEffect(() => {
    document.body.style.overflow = "hidden"
    if (window.location.search.length > 0) {
      service.handleRedirect()
      document.body.style.overflow = "scroll"
      setBlur({})
      setLoginView(null)
    }
    else if (localStorage.getItem("access_token")){
      if (service.onPageLoad()){
        document.body.style.overflow = "scroll"
        setBlur({})
        setLoginView(null)
      }
    }

    service.getName().then(res => setName(res))
  }, [])

  const onLogin = () => {
      service.requestAuthorization()
  } 
  
  const onNewSelect = (id) => {
    if (switcher == 1){
      service.getArtistAlbums(id, 1, 0).then(res => {setTotal(res.total); setColsCount(res.total); setRowsCount(1)})
      service.setArtistsAlbums(id).then(res => setAlbums(res))
    }
    if (switcher == 2){
      service.getPlaylistAlbums(id, 1, 0).then(res => {setTotal(res.total); setColsCount(res.total); setRowsCount(1); console.log(res)})
      service.setPlaylistAlbums(id).then(res => setAlbums(res))
    }
  }

  return (
    <>
        { isloginView ? <div className="blurredView">
            <div className="modalEnter">
                <span className="greetings">Hello! To create a collage enter <span>Spotify</span>:</span>
                <button className="enterSpoti" onClick={onLogin}>
                    <img src={spotiLogo} alt="Spotify Logo" className="spotiLogo"/>
                </button>
            </div>
        </div> : null}
      <div className="blur" style={blur}>
        <header>
          <div className="subheader-container">
            <div className="subheader-nickname">{name}</div>
          </div>
          <h1>Collagify</h1>
        </header>
        <div className="container">

          <section className="choose-source">
            <h2>Choose what to make a collage from</h2>
            <Switcher onSwitch={(state) => setSwitcher(state)}/>
            <CheckList switch={switcher} newSelect={(id) => onNewSelect(id)}/>
          </section>

          <section className="col-size">
            <SizeSlider onSizeChange={(newRow) => {setRowsCount(+newRow)}} rows={rowsCount} columns={colsCount} total={total} header="Rows"/>
            <SizeSlider onSizeChange={(newCol) => {setColsCount(+newCol)}} rows={rowsCount} columns={colsCount} total={total} header="Columns"/>
          </section>

          <Preview rows={+rowsCount} cols={+colsCount} albums={albums}/>
        </div>
      </div>
    </>
  );
}

export default App;
