import {Route, Routes} from "react-router-dom";

import Header from './view/header/Header.js'
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";

const getLoggedUser = async () => {
    return await fetch('http://localhost:8080/user', {
        method: 'GET'
    })
}

function App() {
    getLoggedUser()
        .then(res => console.log(res))

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
