import Header from "./header/Header";
import React from "react";
import {toast, ToastContainer} from "react-toastify";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {makeFormRequest} from "../util";

const attemptRegister = async (event) => {
    event.preventDefault()
    const {registerFormUsername, registerFormPassword, registerFormPasswordRepeat} = document.forms[0]
    const uname = registerFormUsername.value
    const pass = registerFormPassword.value
    const passRepeat = registerFormPasswordRepeat.value
    if (pass.length < 6) {
        toast.error('Password should be at least 6 characters')
        return
    }
    if (pass !== passRepeat) {
        toast.error('Passwords do not match')
        return
    }

    makeFormRequest('register', {username: uname, password: pass})
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        console.log(data)
                        toast.success('Successfully registered. You can log in now.')
                    })
            }
            else {
                console.log(res)
                res.json()
                    .then(data => {
                        console.log(data)
                        toast.error(data['error_message'])
                    })
            }
        })
}

function RegisterPage(props) {
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
                <h1>Register</h1>
                <Row>
                    <Col md={6}>
                        <Form onSubmit={attemptRegister}>
                            <Form.Group className='mb-2' controlId='registerFormUsername'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='username' placeholder='Username' />
                            </Form.Group>
                            <Form.Group className='mb-2' controlId='registerFormPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' placeholder='Password' />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='registerFormPasswordRepeat'>
                                <Form.Label>Repeat password</Form.Label>
                                <Form.Control type='password' placeholder='Repeat password' />
                            </Form.Group>
                            <Button variant='primary' type='submit'>
                                Register
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Container className={'m-0 pt-3'}>
                        <small>
                            Already have an account? <Link to={'../login'}>Log in!</Link>
                        </small>
                    </Container>
                </Row>
            </Container>
        </>
    )
}

export default RegisterPage;
