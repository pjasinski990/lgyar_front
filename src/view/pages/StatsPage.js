import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import * as PropTypes from "prop-types";

function StatsPage(props) {
    StatsPage.propTypes = {
        user: PropTypes.object.isRequired,
        onUserChanged: PropTypes.func.isRequired
    }

    return (
        <>
        </>
    )

}

export default StatsPage
