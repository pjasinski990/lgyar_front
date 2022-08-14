import React, {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";

import Header from './view/header/Header.js'
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import ArchivePage from "./view/ArchivePage";
import StatsPage from "./view/StatsPage";
import {makeRequest} from "./util";

const getLoggedUser = async () => {
    let user = {logged: false}
    const res = await makeRequest('user', 'get', null, null)
    if (res.ok) {
        const data = await res.json()
        user.username = data['username']
        user.role = data['role']
        user.activePeriod = data['activePeriod']
        user.previousPeriods = data['previousPeriods']
        user.logged = true
    }
    return user
}

function App() {
    let [user, setUser] = useState({})

    useEffect(() => {
        getLoggedUser()
            .then(user => {
                setUser(user)
            })
    })

    return (
        <>
            <div>
                <Routes>
                    <Route path={'/'} element={user && <Header user={user}/>} />
                    <Route path={'/home'} element={user && <Header user={user}/>} />
                    <Route path={'/login'} element={user && <LoginPage user={user}/>} />
                    <Route path={'/register'} element={user && <RegisterPage user={user}/>} />
                    <Route path={'/archive'} element={user && <ArchivePage user={user}/>} />
                    <Route path={'/stats'} element={user && <StatsPage user={user}/>} />
                </Routes>
            </div>
        </>
    )
}

export default App
