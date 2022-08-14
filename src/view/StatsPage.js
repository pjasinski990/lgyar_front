import Header from './header/Header';
import 'react-toastify/dist/ReactToastify.css'
import React from "react";

function StatsPage(props) {
    return (
        <>
            <Header user={props.user}/>
        </>
    )

}

export default StatsPage
