import { Link } from "react-router-dom";
import HeaderButtons from "./HeaderButtons";

type data = {
    show: boolean
    toggleShowHeader: Function
}

export default function Header( { show, toggleShowHeader } : data ) {
    return (
        <nav className={show ? "header show" : "header"}>
            <ul className="header-content">
                <li>
                    <Link to="/">
                        <div className="logo">
                            <img src="logo.webp" />
                            <h2>Manga Library</h2>
                            <img className="closeButton" src="close-button.webp" onClick={() => toggleShowHeader()} />
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
                <li className="header-buttons">
                    <HeaderButtons></HeaderButtons>
                </li>
            </ul>
        </nav>
    );
}
