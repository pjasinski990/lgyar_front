import Header from "./header/Header";

function RegisterPage(props) {
    return (
        <>
            <Header logged={props.logged}/>
            <h1>Hello from register page</h1>
        </>
    );
}

export default RegisterPage;
