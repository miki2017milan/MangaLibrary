import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface HeaderProps {
  show: boolean;
  closeHeader: () => void;
}

export default function Header({ show, closeHeader }: HeaderProps) {
  const auth = useAuth();

  return (
    <nav className={show ? "header show" : "header"}>
      <ul className="header-content">
        <li className="header-left">
          <Link to="/">
            <img src="/logo.webp" />
            <h2>Manga Library</h2>
          </Link>
          <img className="closeButton" src="/close-button.webp" onClick={() => closeHeader()} />
        </li>
        <li className="header-middle">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/library">My Library</Link>
        </li>
        <li className="header-right">
          {auth.displayName == "" ? (
            <>
              <div className="login">
                <Link to="/login">Login</Link>
              </div>
              <div className="signup">
                <Link to="/register">Sign up</Link>
              </div>
            </>
          ) : (
            <Link to="/profile">{auth.displayName}</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
