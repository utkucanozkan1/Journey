/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star, Cancel } from '@material-ui/icons';
import Register from './Register';
import Login from './Login';

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
  const [userPins, setUserPins] = useState([]);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [visited, setVisited] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [notLogged, setNotLogged] = useState(false);
  const [wishList, setWishList] = useState(false);

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

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/pins');
      setPins(res.data);
    } catch (err) {
      console.log(err);
    }
  };
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

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setCurrentUser(null);
    setLogged(false);
    setNotLogged(false);
    setWishList(false);
    setUserPins([]);
  };
  const handleDeleteClick = (event, username, title) => {
    event.preventDefault();
    if (logged && currentUser === username) {
      const upins = userPins.filter((p) => {
        if (title !== p.title) {
          return p;
        }
      });
      setUserPins([...upins]);
      axios.put('api/pins/', { username, title })
        .then((res) => fetchData())
        .catch((err) => console.log(err));
    } else {
      setNotLogged(true);
      setTimeout(() => {
        setNotLogged(false);
      }, 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (logged) {
      const newLoc = {
        username: currentUser,
        title,
        desc,
        rating,
        lat: newPin.lat,
        long: newPin.lng,
        visited,
      };
      axios.post('/api/pins', newLoc)
        .then((res) => {
          setPins([...pins, res.data]);
          setUserPins([...userPins, res.data]);
        })
        .then(() => setNewPin(null))
        .catch((err) => console.log(err));
    } else {
      setNotLogged(true);
    }
  };
  return (
    <div className="map-div">
      <Map
        {...viewState}
        mapboxAccessToken={config.TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        onDblClick={handleAddClick}
      >
        {wishList && (
        <div className="wishlist">
          {userPins.map((p) => (
            p.visited === 'wishlist' && (
            <div>
              <div className="wishes">
                <Room
                  style={{ color: '#3234f4', cursor: 'pointer' }}
                  onClick={(event) => handleMarkerClick(p._id, event, p.lat, p.long)}
                />
                <span>{p.title}</span>
                <a href="https://www.expedia.com" target="_blank" rel="noreferrer">
                  <button type="button" className="bookBtn">Book</button>
                </a>
              </div>
            </div>
            )
          ))}
        </div>
        )}
        {logged ? userPins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} offsetLeft={-viewState.zoom * 3.5} offsetTop={-viewState.zoom * 7}>
              <Room
                style={{ fontSize: viewState.zoom * 7, color: p.visited === 'visited' ? 'crimson' : '#3234f4', cursor: 'pointer' }}
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
                  <button
                    type="button"
                    className="deleteBtn"
                    onClick={(e) => handleDeleteClick(e, p.username, p.title)}
                  >
                    {' '}
                    Delete pin
                    {' '}

                  </button>
                  {notLogged && <span className="notLogged">Login as the owner of this Pin to Delete!</span>}
                </div>
                <Cancel className="loginCancel" onClick={() => setCurrentPlaceId(null)} />
              </Popup>
            ) : null}
          </>
        )) : pins.map((p) => (
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
                  <button
                    type="button"
                    className="deleteBtn"
                    onClick={(e) => handleDeleteClick(e, p.username, p.title)}
                  >
                    {' '}
                    Delete pin
                    {' '}

                  </button>
                  {notLogged && <span className="notLogged">Login as the owner of this Pin to Delete!</span>}
                </div>
                <Cancel className="loginCancel" onClick={() => setCurrentPlaceId(null)} />
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
              <label>Visited ?</label>
              <select onChange={(e) => setVisited(e.target.value)}>
                <option value="null" />
                <option value="visited">Visited</option>
                <option value="wishlist">Wishlist</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
              {notLogged && <span className="notLogged">You are not logged in!</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setNewPin(null)} />
          </div>
        </Popup>
        )}
      </Map>
      <div className="dialog">
        <select className="box" onChange={(e) => setMapStyle(e.target.value)}>
          <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
          <option value="mapbox://styles/mapbox/satellite-streets-v11">Satellite</option>
          <option value="mapbox://styles/mapbox/navigation-night-v1">Dark Mode</option>
        </select>
        {logged && !wishList && <button type="button" className="wishBtn" onClick={() => setWishList(true)}>Travel Wishlist</button>}
        {wishList && <button type="button" className="wishBtnClose" onClick={() => setWishList(false)}>Close Wishlist</button>}
        <img src="journey-logo-black-and-white.png" className="logo-div-image" />
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} setLogged={setLogged} setNotLogged={setNotLogged} pins={pins} setUserPins={setUserPins} />}
        {currentUser ? (<button type="button" className="button logout" onClick={(e) => handleLogoutClick(e)}>Logout</button>) : (
          <div className="buttons">
            <button type="button" className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button type="button" className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
// render the root element with the provided component
root.render(<App />);
