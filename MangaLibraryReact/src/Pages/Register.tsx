import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/AuthProvider";

export default function Register() {
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const [matches, setMatches] = useState(true);
  const auth = useAuth();

  const registerUser = () => {
    if (
      email.current?.value &&
      password.current?.value &&
      passwordConfirm.current?.value &&
      username.current?.value
    ) {
      auth.register(
        email.current.value,
        username.current.value,
        password.current.value,
        passwordConfirm.current.value
      );
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <div className="formFields">
        <p>Email</p>
        <input ref={email} type="email" />
        <p>Username</p>
        <input ref={username} type="name" />
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
