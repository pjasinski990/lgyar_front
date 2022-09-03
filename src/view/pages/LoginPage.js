import {Button, Container, Form} from 'react-bootstrap';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import React from "react";
import {makeBackendFormRequest} from "../../backendUtil";
import {Link} from "react-router-dom";

const postLogin = async (username, password) => {
    return makeBackendFormRequest('login', {username: username, password: password})
}

function LoginPage(props) {
    const attemptLogin = async (event) => {
        event.preventDefault()
        const {loginFormUsername, loginFormPassword} = document.forms[0]
        if (!loginFormUsername.value) {
            toast.error('Username field is empty')
            return
        }
        if (!loginFormPassword.value) {
            toast.error('Password field is empty')
            return
        }
        postLogin(loginFormUsername.value, loginFormPassword.value)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            // TODO this is not safe. use httponly cookies instead of local storage
                            sessionStorage.setItem('access_token', data['access_token'])
                            sessionStorage.setItem('refresh_token', data['refresh_token'])
                            props.onUserLogin()
                        })
                }
                else {
                    toast.error('Incorrect credentials')
                }
            })
    }

    return (
        <>
            <Container className={'content-container border'}>
                <div className={'col-md-4 mx-auto'}>
                    <h1>Log in</h1>
                    <Form onSubmit={attemptLogin}>
                        <Form.Group className='mb-2' controlId='loginFormUsername'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='username' placeholder='Username' />
                        </Form.Group>
                        <Form.Group className='mb-4' controlId='loginFormPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Password' />
                        </Form.Group>
                        <div className={'d-grid'}>
                            <Button variant='primary' type='submit' block={'true'}>
                                Log in
                            </Button>
                        </div>
                    </Form>
                    <div className={'mx-0 pt-1'}>
                        <small>
                            Don't have an account? <Link to={'../register'}>Register!</Link>
                        </small>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default LoginPage
