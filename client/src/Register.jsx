import React, { useState, useRef } from 'react';
import { Room, Cancel } from '@material-ui/icons';
import axios from 'axios';

export default function Register({setShowRegister}) {
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post('/api/users/register', newUser);
      setFail(false);
      setSuccess(true);
      setTimeout(() => {
        setShowRegister(false);
      }, 2500);
    } catch (err) {
      setFail(true);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        Journey
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
        {success && <span className="success"> Success! You can now Login! </span>}
        {fail && <span className="failure"> Something went wrong! </span>}
      </form>
      <Cancel className="registerCancel" onClick={() => setShowRegister(false)} />
    </div>
  );
}
