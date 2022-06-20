/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star } from '@material-ui/icons';
import Register from './Register';

const config = require('./config');

const root = createRoot(document.getElementById('root'));

function App() {
  const [viewState, setViewState] = useState({
    latitude: 48.860294,
    longitude: 2.338629,
    zoom: 5,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPin, setNewPin] = useState(null);
  const [pins, setPins] = useState([]);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/api/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [currentPlaceId]);

  const handleMarkerClick = (id, event, lat, long) => {
    event.stopPropagation();
    setCurrentPlaceId(id);
    setViewState({
      ...viewState, latitude: lat, longitude: long,
    });
    setShowPopup(true);
  };

  const handleAddClick = (e) => {
    console.log(e);
    const { lng, lat } = e.lngLat;
    setNewPin({
      lat,
      lng,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLoc = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPin.lat,
      long: newPin.lng,
    };
    axios.post('/api/pins', newLoc)
      .then((res) => setPins([...pins, res.data]))
      .then(() => setNewPin(null))
      .catch((err) => console.log(err));
  };
  return (
    <div className="map-div">
      <Map
        {...viewState}
        mapboxAccessToken={config.TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} offsetLeft={-viewState.zoom * 3.5} offsetTop={-viewState.zoom * 7}>
              <Room
                style={{ fontSize: viewState.zoom * 7, color: p.username === currentUser ? 'crimson' : 'gray', cursor: 'pointer' }}
                onClick={(event) => handleMarkerClick(p._id, event, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId ? (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by&nbsp;
                    <b>{p.username}</b>
                  </span>
                  <span className="date">{moment(p.createdAt).format('MMM Do YY')}</span>
                </div>
              </Popup>
            ) : null}
          </>
        ))}
        {newPin && (
        <Popup
          latitude={newPin.lat}
          longitude={newPin.lng}
          anchor="left"
          onClose={() => setNewPin(null)}
        >
          <div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <label>Place</label>
              <input
                placeholder="Enter Place Name"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Add your Review"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </div>
        </Popup>
        )}
      </Map>
      <Register />
      {currentUser ? (<button type="button" className="button logout">Logout</button>) : (
        <div className="buttons">
          <button type="button" className="button login">Login</button>
          <button type="button" className="button register">Register</button>
        </div>
      )}
    </div>
  );
}
export default App;
// render the root element with the provided component
root.render(<App />);
