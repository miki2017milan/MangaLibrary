import { Link } from "react-router-dom";
import HeaderButtons from "./HeaderButtons";

export default function Header() {
    return (
        <nav className="header">
            <ul className="header-content">
                <li>
                    <Link to="/">
                        <div className="logo">
                            <img src="logo.webp" />
                            <h2>Manga Library</h2>
                        </div>
                    </Link>
                </li>
                <li>
                    <div className="header-nav">
                        <Link className="nav-link" to="/search">
                            Search
                        </Link>
                        <Link className="nav-link" to="/library">
                            My Library
                        </Link>
                    </div>
                </li>
                <li>
                    <div className="header-buttons">
                        <HeaderButtons></HeaderButtons>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
