import Header from './header/Header';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React from "react";

const postLogin = async (username, password) => {
    // TODO refactor creating form data out of this function
    let formBody = [];
    formBody.push(encodeURIComponent('username') + '=' + encodeURIComponent(username))
    formBody.push(encodeURIComponent('password') + '=' + encodeURIComponent(password))
    formBody = formBody.join("&");

    // TODO use correct backend address
    // const address = 'http://' + process.env.REACT_APP_BACKEND_ADDRESS + '/login'
    const address = 'http://localhost:8081/login'
    console.log('Sending %s to %s', formBody, address)
    return await fetch(address, {
        body: formBody,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        }
    })
}

const attemptLogin = async (event) => {
    event.preventDefault()
    const {loginFormUsername, loginFormPassword} = document.forms[0]
    console.log('Submitting login data: %s %s', loginFormUsername.value, loginFormPassword.value)
    postLogin(loginFormUsername.value, loginFormPassword.value)
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        // TODO store / update access_token and refresh_token
                        console.log(data)

                        toast.success('Logged in successfully')
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
            <Header logged={props.logged}/>
            <ToastContainer
                position="top-center"
                autoClose={3000}
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
    );
}

export default LoginPage;
