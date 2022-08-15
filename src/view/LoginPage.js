import Header from './header/Header';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import {makeFormRequest} from "../util";
import {Link} from "react-router-dom";

const postLogin = async (username, password) => {
    return makeFormRequest('login', {username: username, password: password})
}

const attemptLogin = async (event) => {
    event.preventDefault()
    const {loginFormUsername, loginFormPassword} = document.forms[0]
    postLogin(loginFormUsername.value, loginFormPassword.value)
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        // TODO this is not safe. use httponly cookies instead of local storage
                        sessionStorage.setItem('access_token', data['access_token'])
                        sessionStorage.setItem('refresh_token', data['refresh_token'])
                        window.location.replace('/home')
                    })
            }
            else {
                toast.error('Incorrect credentials')
            }
        })
}

function LoginPage(props) {
    return (
        <>
            <Header user={props.user}/>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Container className={'content-container'}>
                <h1>Log in</h1>
                <Row>
                    <Col sm={4}>
                        <Form onSubmit={attemptLogin}>
                            <Form.Group className='mb-2' controlId='loginFormUsername'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='username' placeholder='Username' />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='loginFormPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' placeholder='Password' />
                            </Form.Group>
                            <Button variant='primary' type='submit'>
                                Log in
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Container className={'m-0 pt-2 pl-0'}>
                        <small>
                            Don't have an account? <Link to={'../register'}>Register!</Link>
                        </small>
                    </Container>
                </Row>
            </Container>
        </>
    )
}

export default LoginPage
