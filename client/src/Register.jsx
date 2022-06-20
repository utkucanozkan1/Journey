import React from 'react';

export default function Register() {
  return (
    <div className="registerContainer">
      <div className="logo">
        <img className="santa" src="santa.png"></img>
      </div>
      <form>
        <input type="text" placeholder="username"></input>
        <input type="email" placeholder="email"></input>
        <input type="password" placeholder="password"></input>
        <button>Register</button>
      </form>
    </div>
  );
}
