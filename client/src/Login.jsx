import React, { useState, useRef } from 'react';
import { Room, Cancel } from '@material-ui/icons';
import axios from 'axios';

export default function Login({ setShowLogin, setCurrentUser , setLogged, setNotLogged, pins, setUserPins }) {
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
		  username: nameRef.current.value,
		  password: passwordRef.current.value,
    };
    axios.post('/api/users/login', user)
      .then((res) => {
        setCurrentUser(res.data.username);
        const upins = pins.filter((p) => {
          if (user.username === p.username) {
            return p;
          }
        });
        console.log(upins);
        setUserPins([...upins]);
        setSuccess(true);
        setFail(false);
        setLogged(true);
        setNotLogged(false);
        setTimeout(() => {
          setShowLogin(false);
        }, 1300);
	    })
      .catch((err) => {
        setFail(true);
      });
  };
  const handleKeyPress = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      const user = {
        username: nameRef.current.value,
        password: passwordRef.current.value,
      };
      axios.post('/api/users/login', user)
        .then((res) => {
          setCurrentUser(res.data.username);
          const upins = pins.filter((p) => {
            if (user.username === p.username) {
              return p;
            }
          });
          console.log(upins);
          setUserPins([...upins]);
          setSuccess(true);
          setFail(false);
          setLogged(true);
          setNotLogged(false);
          setTimeout(() => {
            setShowLogin(false);
          }, 1300);
        })
        .catch((err) => {
          setFail(true);
        });
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
      <img src="journey-logo-black-and-white.png" className="logo-div-image-login" />
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button
          type="button"
          className="loginBtn"
          onClick={(e) => handleSubmit(e)}
          onKeyPress={(e) => handleKeyPress(e)}
        >
          Login
        </button>
        {success && <span className="success"> Success! </span>}
        {fail && <span className="failure"> Wrong Username or Password! </span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
