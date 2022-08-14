import React from "react";
import {Route, Routes} from "react-router-dom";

import Header from './view/header/Header.js'
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import ArchivePage from "./view/ArchivePage";
import StatsPage from "./view/StatsPage";

const getLoggedUser = () => {
    let user = {username: null, access_token: null, refresh_token: null}
    user.username = 'temp_username'
    user.avatar = 'temp_url'
    user.access_token = sessionStorage.getItem('access_token')
    user.refresh_token = sessionStorage.getItem('refresh_token')
    return user
}

function App() {
    let user = getLoggedUser()
    console.log(user)
    return (
        <>
            <div>
                <Routes>
                    <Route path={'/'} element={<Header user={user}/>} />
                    <Route path={'/home'} element={<Header user={user}/>} />
                    <Route path={'/login'} element={<LoginPage user={user}/>} />
                    <Route path={'/register'} element={<RegisterPage user={user}/>} />
                    <Route path={'/archive'} element={<ArchivePage user={user}/>} />
                    <Route path={'/stats'} element={<StatsPage user={user}/>} />
                </Routes>
            </div>
        </>
    )
}

export default App
