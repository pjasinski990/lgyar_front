import Header from './header/Header';
import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";

function HomeLogged(props) {
    return (
        <>
            <Header user={props.user}/>
            <Container className={'content-container'}>
                <h1>Welcome!</h1>
            </Container>
        </>
    )
}

function HomeNonLogged(props) {
    return (
        <>
            <Header user={props.user}/>
            <Container className={'content-container'}>
                <h1>Welcome!</h1>
                <p>Please <Link to={'../login'}>log in</Link> to get started.</p>
            </Container>
        </>
    )
}

function HomePage(props) {
    if (props.user.logged) {
        return HomeLogged(props)
    }
    else {
        return HomeNonLogged(props)
    }
}

export default HomePage
