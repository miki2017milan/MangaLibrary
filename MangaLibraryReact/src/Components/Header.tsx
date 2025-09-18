import { Link } from "react-router-dom";
import HeaderButtons from "./HeaderButtons";

export default function Header() {
    return (
        <div className="header">
            <div className="header-content">
                <Link to="/">
                    <div className="logo">
                        <img src="logo.webp" />
                        <h2>Manga Library</h2>
                    </div>
                </Link>
                <div className="full-w">
                    <div className="header-nav">
                        <Link className="nav-link" to="/search">
                            Search
                        </Link>
                        <Link className="nav-link" to="/library">
                            My Library
                        </Link>
                    </div>
                </div>

                <div className="header-buttons">
                    <HeaderButtons></HeaderButtons>
                </div>
            </div>
        </div>
    );
}
