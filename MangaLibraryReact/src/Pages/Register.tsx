import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);
  const [matches, setMatches] = useState(true);

  const registerUser = () => {
    console.log(password.current?.value, passwordConfirm.current?.value);
    if (password.current?.value != passwordConfirm.current?.value) {
      setMatches(false);
      return;
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <div className="formFields">
        <p>Email</p>
        <input type="email" />
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
