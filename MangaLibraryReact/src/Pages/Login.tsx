import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="form">
      <h2>Login</h2>
      <div className="formFields">
        <p>Email</p>
        <input type="email" />
        <p>Password</p>
        <input type="password" />
        <button>Login</button>
        <p className="forgot">Forgot password?</p>
      </div>
      <div className="newAccount">
        <p>No account?</p>
        <Link to="/register">Create account</Link>
      </div>
    </div>
  );
}
