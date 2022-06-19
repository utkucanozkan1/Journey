import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room } from '@material-ui/icons';

const config = require('./config');


const root = createRoot(document.getElementById('root'));

function App() {
  const [viewState, setViewState] = useState({
    latitude: 48.860294,
    longitude: 2.338629,
    zoom: 5,
  });
  const [showPopup, setShowPopup] = useState(true);
  const [pins, setPins] = useState([])

  useEffect(() => {
    axios.get('/pins')
      .then((res) => setPins(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="map-div">
      <Map
        {...viewState}
        mapboxAccessToken={config.TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
      >
        <Marker longitude={2.338629} latitude={48.860294} offsetLeft={-20} offsetTop={-10}>
          <Room style={{ fontSize: viewState.zoom * 7, color: 'slateblue' }} />
        </Marker>
        <Popup
          longitude={2.338629}
          latitude={48.860294}
          anchor="left" >
            <div className="card">
              <label>Place</label>
              <label>Review</label>
              <label>Rating</label>
              <label>Information</label>
            </div>
        </Popup>
      </Map>
    </div>
  );
}
export default App;
// render the root element with the provided component
root.render(<App />);
