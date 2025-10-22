import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthProvider";
import PasswordValidator from "../Components/PasswordValidator";
import FormField from "../Components/FormField";

export default function Register() {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [passwordFail, setPasswordFail] = useState<string>("");
  const [emailFail, setEmailFail] = useState<string>("");
  const [usernameFail, setUsernameFail] = useState<string>("");

  const [matches, setMatches] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  const registerUser = async () => {
    var valid = true;
    if (email == "") {
      setEmailFail("Email required");
      valid = false;
    }

    if (!email.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm)) {
      setEmailFail("Email not valid");
      valid = false;
    }

    if (password == "") {
      setPasswordFail("Password required");
      valid = false;
    }

    if (
      !password.match(
        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[\!\*\%\#\@\&\^\$\;\:\.\,\§])(?=\S*?[0-9]).{7,})\S$/
      )
    ) {
      setPasswordFail("Requierments not met");
      valid = false;
    }

    if (username == "") {
      setUsernameFail("Username required");
      valid = false;
    }

    if (password !== passwordConfirm) {
      setMatches(false);
      valid = false;
    }

    if (valid) {
      const { succsess, errors } = await auth.register(email, username, password, passwordConfirm);

      if (succsess) {
        navigate("/library");
        return;
      }

      errors.forEach((error: any) => {
        var code = error.code;

        if (code === "DuplicateUserName") {
          setEmailFail("Email already taken");
          return;
        }
      });
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
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
          title="Username"
          failState={usernameFail}
          onChange={(e: any) => {
            setUsernameFail("");
            setUsername(e.target.value);
          }}
          type=""
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
        <PasswordValidator password={password} />

        <FormField
          title="Password confirm"
          failState={!matches ? "Passwords do not match" : ""}
          onChange={(e: any) => {
            setMatches(true);
            setPasswordConfirm(e.target.value);
          }}
          type="password"
        />

        <button onClick={registerUser}>Register</button>
      </div>
      <div className="newAccount">
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
