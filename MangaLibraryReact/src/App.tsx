import "./App.css";

import MainLayout from "./Layouts/MainLayout";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import Library from "./Pages/Library";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MangaDisplay from "./Pages/MangaDisplay";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route path="manga" element={<MangaDisplay />} />
                    <Route path="library" element={<Library />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
