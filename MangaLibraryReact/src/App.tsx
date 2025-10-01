import "./App.css";

import MainLayout from "./Layouts/MainLayout";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import Library from "./Pages/Library";
import MangaDisplay from "./Pages/MangaDisplay";
import NotFound from "./Pages/NotFound";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route path="manga/:mangaId?" element={<MangaDisplay />} />
                    <Route path="library" element={<Library />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
