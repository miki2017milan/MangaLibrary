import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const [matches, setMatches] = useState(true);

  const registerUser = () => {
    if (password.current?.value != passwordConfirm.current?.value) {
      setMatches(false);
      return;
    }

    const url = "http://localhost:6060/api/account/register";
    const data = {
      email: email.current?.value,
      password: password.current?.value,
    };

    axios.post(url, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  return (
    <div className="form">
      <h2>Register</h2>
      <div className="formFields">
        <p>Email</p>
        <input ref={email} type="email" />
        <p>Password</p>
        <input ref={password} type="password" />
        <p>Confirm Password</p>
        <input
          ref={passwordConfirm}
          type="password"
          className={matches ? "" : "failInput"}
          onChange={() => setMatches(true)}
        />
        {matches ? null : <p className="failText">Passwords do not match</p>}
        <button onClick={registerUser}>Register</button>
      </div>
      <div className="newAccount">
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
