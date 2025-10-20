import { useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/AuthProvider";

export default function Login() {
  const password = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const loginUser = () => {
    if (email.current?.value && password.current?.value) {
      console.log(auth.login(email.current.value, password.current.value));
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <div className="formFields">
        <p>Email</p>
        <input ref={email} type="email" />
        <p>Password</p>
        <input ref={password} type="password" />
        <button onClick={loginUser}>Login</button>
        <p className="forgot">Forgot password?</p>
      </div>
      <div className="newAccount">
        <p>No account?</p>
        <Link to="/register">Create account</Link>
      </div>
    </div>
  );
}
