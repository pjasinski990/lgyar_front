import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";


function LandingPage(props) {
    return (
        <>
            <Container className={'content-container'}>
                <h1>Welcome!</h1>
                <h5>Please <Link to={'../login'}>log in</Link> to get started.</h5>
            </Container>
        </>
    )
}

export default LandingPage
