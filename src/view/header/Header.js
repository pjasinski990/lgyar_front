import {Container, Image, Nav, Navbar} from 'react-bootstrap';
import defaultAvatar from '../../res/defaultAvatar.png';

function MainNav() {
    return (
        <Nav className='me-auto'>
            <Nav.Link href='home'>Home</Nav.Link>
            <Nav.Link href='features'>Features</Nav.Link>
            <Nav.Link href='pricing'>Pricing</Nav.Link>
        </Nav>
    )
}

function SideNavLogged() {
    return (
        <Nav>
            <Nav.Link href='user'>Account</Nav.Link>
            <Container className={'align-self-center'}>
                <Image roundedCircle={true} width={30} height={30} src={defaultAvatar}></Image>
            </Container>
        </Nav>
    )
}

function SideNavNonLogged() {
    return (
        <Nav>
            <Nav.Link href='login'>Login</Nav.Link>
            <Nav.Link href='register'>Register</Nav.Link>
        </Nav>
    )
}

function HeaderLogged() {
    return (
        <Navbar bg={'dark'} variant={'dark'}>
            <Container>
                <Navbar.Brand href='/'>Navbar</Navbar.Brand>
                <MainNav/>
                <SideNavLogged/>
            </Container>
        </Navbar>
    );
}

function HeaderNonLogged() {
    return (
        <Navbar bg={'dark'} variant={'dark'}>
            <Container>
                <Navbar.Brand href='/'>Navbar</Navbar.Brand>
                <MainNav/>
                <SideNavNonLogged/>
            </Container>
        </Navbar>
    );
}

function Header(props) {
    const logged = props.logged
    return logged ? <HeaderLogged/> : <HeaderNonLogged/>
}

export default Header;
