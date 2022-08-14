import {Container, Image, Nav, Navbar} from 'react-bootstrap';
import defaultAvatar from '../../res/defaultAvatar.png';
import React from "react";
import {toast} from "react-toastify";

const logout = async (event) => {
    event.preventDefault()
    sessionStorage.clear()
    window.location.replace('/home')
    toast.success('Logged out successfully')
}

function HeaderLogged() {
    return (
        <>
            <Navbar bg={'dark'} variant={'dark'}>
                <Container>
                    <Navbar.Brand href='/home'>LGYAR</Navbar.Brand>
                    <Nav className='me-center'>
                        <Nav.Link href='home'>Home</Nav.Link>
                        <Nav.Link href='archive '>Archive</Nav.Link>
                        <Nav.Link href='stats'>Stats</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href='logout' onClick={logout}>Logout</Nav.Link>
                        <Nav.Link href='account'>Account</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

function HeaderNonLogged() {
    return (
        <Navbar bg={'dark'} variant={'dark'}>
            <Container>
                <Navbar.Brand href='/home'>LGYAR</Navbar.Brand>
                <Nav>
                    <Nav.Link href='login'>Login</Nav.Link>
                    <Nav.Link href='register'>Register</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

function Header(props) {
    const logged = !!props.user.access_token
    return logged ? <HeaderLogged/> : <HeaderNonLogged/>
}

export default Header;
