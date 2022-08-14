import Header from "./header/Header";
import React from "react";

function RegisterPage(props) {
    return (
        <>
            <Header user={props.user}/>
            <h1>Hello from register page</h1>
        </>
    );
}

export default RegisterPage;
