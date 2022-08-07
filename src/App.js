import React from "react";
import {Route, Routes} from "react-router-dom";

import Header from './view/header/Header.js'
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";

const getLoggedUser = async () => {
    // TODO retrieve token from the session / cookie
    // return username, avatar and role
}

function App() {
    const logged = false
    return (
        <>
            <div>
                <Routes>
                    <Route path={'/'} element={<Header logged={logged}/>} />
                    <Route path={'/home'} element={<Header logged={logged}/>} />
                    <Route path={'/login'} element={<LoginPage logged={logged}/>} />
                    <Route path={'/register'} element={<RegisterPage logged={logged}/>} />
                </Routes>
            </div>
        </>
    );
}

export default App;
