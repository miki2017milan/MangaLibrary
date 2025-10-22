import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthProvider";
import FormField from "../Components/FormField";

export default function Login() {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passwordFail, setPasswordFail] = useState<string>("");
  const [emailFail, setEmailFail] = useState<string>("");

  const auth = useAuth();
  const navigate = useNavigate();

  const loginUser = async () => {
    var valid = true;

    if (!email.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm)) {
      setEmailFail("Email not valid");
      valid = false;
    }

    if (email == "") {
      setEmailFail("Email required");
      valid = false;
    }

    if (password == "") {
      valid = false;
      setPasswordFail("Password required");
    }

    if (valid) {
      const { succsess, errors } = await auth.login(email, password);
      if (succsess) {
        navigate("/library");
        return;
      }

      if (errors.detail === "Login failed: Email or password are incorrect") {
        setEmailFail("Email or password are incorrect");
        setPasswordFail("Email or password are incorrect");
      }
      return;
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <div className="formFields">
        <FormField
          title="Email"
          failState={emailFail}
          onChange={(e: any) => {
            setEmailFail("");
            setEmail(e.target.value);
          }}
          type="email"
        />
        <FormField
          title="Password"
          failState={passwordFail}
          onChange={(e: any) => {
            setPasswordFail("");
            setPassword(e.target.value);
          }}
          type="password"
        />
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
