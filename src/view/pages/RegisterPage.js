import React from "react";
import {toast} from "react-toastify";
import {Button, Container, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {makeBackendFormRequest} from "../../util";

const attemptRegister = async (event) => {
    event.preventDefault()
    const {registerFormUsername, registerFormPassword, registerFormPasswordRepeat} = document.forms[0]
    const uname = registerFormUsername.value
    const pass = registerFormPassword.value
    const passRepeat = registerFormPasswordRepeat.value
    if (uname.length < 6) {
        toast.error('Username should be at least 6 characters')
        return
    }
    if (pass.length < 6) {
        toast.error('Password should be at least 6 characters')
        return
    }
    if (pass !== passRepeat) {
        toast.error('Passwords do not match')
        return
    }

    makeBackendFormRequest('register', {username: uname, password: pass})
        .then(res => {
            if (res.ok) {
                res.json()
                    .then(data => {
                        toast.success('Successfully registered. You can log in now.')
                    })
            }
            else {
                res.json()
                    .then(data => {
                        toast.error(data['error_message'])
                    })
            }
        })
}

function RegisterPage(props) {
    return (
        <>
            <Container className={'content-container'}>
                <div className={'col-md-4 mx-auto'}>
                    <h1>Register</h1>
                    <Form onSubmit={attemptRegister}>
                        <Form.Group className='mb-2' controlId='registerFormUsername'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='username' placeholder='Username' />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='registerFormPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Password' />
                        </Form.Group>
                        <Form.Group className='mb-4' controlId='registerFormPasswordRepeat'>
                            <Form.Label>Repeat password</Form.Label>
                            <Form.Control type='password' placeholder='Repeat password' />
                        </Form.Group>
                        <div className={'d-grid'}>
                            <Button variant='primary' type='submit' block={'true'}>
                                Register
                            </Button>
                        </div>
                    </Form>
                    <div className={'m-0 pt-1'}>
                        <small>
                            Already have an account? <Link to={'../login'}>Log in!</Link>
                        </small>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default RegisterPage;
