import React, {useState} from 'react'
import * as PropTypes from 'prop-types'
import {Navigate, Route, Routes} from 'react-router-dom'
import LoginPage from './view/pages/LoginPage'
import RegisterPage from './view/pages/RegisterPage'
import ArchivePage from './view/pages/ArchivePage'
import StatsPage from './view/pages/StatsPage'
import {sessionGetLoggedUser, sessionLoadUserData} from './backendUtil'
import HomePage from './view/pages/HomePage'
import AdminPage from './view/pages/AdminPage'
import Header from './view/components/header/Header'
import Footer from './view/components/footer/Footer'
import LandingPage from './view/pages/LandingPage'
import ThreeDots from "react-loading-icons/dist/esm/components/three-dots";

function App() {
    const [user, setUser] = useState(sessionGetLoggedUser())
    const [loading, setLoading] = useState(false)

    const onUserLogin = () => {
        setLoading(true)
        sessionLoadUserData()
            .then(() => {
                setUser(sessionGetLoggedUser())
                setLoading(false)
                window.location.replace('home')
            })
    }

    const onUserLogout = () => {
        setUser(null)
        sessionStorage.clear()
        window.location.replace('landing')
    }

    function ProtectedRoute (props) {
        ProtectedRoute.propTypes = {
            user: PropTypes.object.isRequired
        }
        if (!props.user) {
            return <Navigate to={'/landing'} replace={true}/>
        }
        return props.children
    }

    return (
    <>
        <div>
            {loading ?
            <>
                <Header user={null} onUserLogout={onUserLogout}/>
                <div id={'loading-icon'} className={'d-flex justify-content-center align-items-center'}>
                    <ThreeDots stroke='green' height={'5em'}/>
                </div>
            </>
                :
            <>
                <Header user={user} onUserLogout={onUserLogout}/>
                <Routes>
                    <Route path={''} element={<LandingPage user={user}/>}/>
                    <Route path={'landing'} element={<LandingPage user={user}/>}/>
                    <Route path={'login'} element={<LoginPage user={user} onUserLogin={onUserLogin}/>}/>
                    <Route path={'register'} element={<RegisterPage user={user}/>}/>

                    <Route path={'home'} element={
                        <ProtectedRoute user={user}>
                            <HomePage user={user}/>
                        </ProtectedRoute>
                    }/>
                    <Route path={'archive'} element={
                        <ProtectedRoute user={user}>
                            <ArchivePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path={'stats'} element={
                        <ProtectedRoute user={user}>
                            <StatsPage user={user}/>
                        </ProtectedRoute>
                    }/>
                    <Route path={'admin'} element={
                        <ProtectedRoute user={user}>
                            <AdminPage user={user}/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </>
            }
        </div>
    <Footer/>
    </>
)
}

export default App
