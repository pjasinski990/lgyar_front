import './App.css';
import defaultAvatar from './res/defaultAvatar.png'
import {Container, Image, Nav, Navbar} from "react-bootstrap";

const userAction = async () => {
    const testUser = {username: 'magic_mike', password: 'password123'}
    fetch('http://localhost:8080/login', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(testUser),
        headers: {'Content-Type': 'application/json'}
    })
            .then(res => {console.log(res)})
            .catch((err, res) => {console.log(err); console.log(res)})

    // do something with myJson
}

function App() {
    let res;
    res = userAction();
    console.log(res)

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#user">Account</Nav.Link>
                        <Container className={'align-self-center'}>
                            <Image roundedCircle={true} width={30} height={30} src={defaultAvatar}></Image>
                        </Container>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default App;
