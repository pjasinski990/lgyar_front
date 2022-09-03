import {Container, Nav, Navbar} from 'react-bootstrap'
import React from "react"
import {toast, ToastContainer} from "react-toastify"

function HeaderLogged(props) {
    const logout = event => {
        event.preventDefault()
        props.onUserLogout()
    }

    return (
        <>
            <Navbar bg={'dark'} variant={'dark'}>
                <Container>
                    <Navbar.Brand href='/home'>LGYAR</Navbar.Brand>
                    <Nav className='me-center'>
                        <Nav.Link href='home'>Home</Nav.Link>
                        <Nav.Link href='archive '>Archive</Nav.Link>
                        <Nav.Link href='stats'>Stats</Nav.Link>
                        {props.isAdmin && <Nav.Link href='admin'>Admin</Nav.Link>}
                    </Nav>
                    <Nav>
                        <Nav.Link href='account'>Account</Nav.Link>
                        <Nav.Link href='logout' onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

function HeaderNonLogged(props) {
    return (
        <>
            <Navbar bg={'dark'} variant={'dark'}>
                <Container>
                    <Navbar.Brand href='/home'>LGYAR</Navbar.Brand>
                    <Nav>
                        <Nav.Link href='login'>Login</Nav.Link>
                        <Nav.Link href='register'>Register</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

function Header(props) {
    if (props.error) {
        toast.error(props.error)
    }

    let isAdmin = false
    if (props.user) {
        isAdmin = props.user.role === 'ROLE_ADMIN'
    }
    return props.user ? <HeaderLogged isAdmin={isAdmin} onUserLogout={props.onUserLogout}/> : <HeaderNonLogged/>
}

export default Header
