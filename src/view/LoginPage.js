import Header from './header/Header';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import {makeFormRequest} from "../util";

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
            <Container>
                <Row className={'mt-4 p-2'}>
                    <Col sm={4}>
                        <h1>Log in</h1>
                        <Form onSubmit={attemptLogin}>
                            <Form.Group className='mb-3' controlId='loginFormUsername'>
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
            </Container>
        </>
    )
}

export default LoginPage
