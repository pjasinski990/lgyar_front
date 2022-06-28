import Header from './header/Header';
import {Alert, Button, Col, Container, Form, Row} from 'react-bootstrap';

const showError = (heading, text) => {
    return (
        <Alert variant="danger" dismissible>
            <Alert.Heading>{heading}</Alert.Heading>
            <p>{text}</p>
        </Alert>
    );
}

const postLogin = async (username, password) => {
    const testUser = {username: username, password: password}
    fetch('http://localhost:8080/login', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(testUser),
        headers: {'Content-Type': 'application/json'}
    })
}

const submitLoginData = (event) => {
    event.preventDefault()
    const {loginFormUsername, loginFormPassword} = document.forms[0]
    postLogin(loginFormUsername.value, loginFormPassword.value)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
}

function LoginPage(props) {

    return (
        <>
            <Header logged={props.logged}/>
            <Container>
                <Row className={'mt-4 p-2'}>
                    <Col sm={4}>
                        <h1>Log in</h1>
                        <Form onSubmit={submitLoginData}>
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
