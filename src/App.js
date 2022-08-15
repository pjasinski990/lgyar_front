import React, {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import ArchivePage from "./view/ArchivePage";
import StatsPage from "./view/StatsPage";
import {makeRequest} from "./util";
import HomePage from "./view/HomePage";

const getEmptyUser = () => {
    return {
        username: '',
        role: '',
        activePeriod: {},
        previousPeriods: [],
        logged: false
    }
}

const getLoggedUser = async () => {
    let user = getEmptyUser()
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
    let [user, setUser] = useState(getEmptyUser())
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
                    <Route path={'/'} element={user && <HomePage user={user}/>} />
                    <Route path={'/home'} element={user && <HomePage user={user}/>} />
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
