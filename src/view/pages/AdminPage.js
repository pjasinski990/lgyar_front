import React from "react";
import * as PropTypes from "prop-types";

function AdminPage(props) {
    AdminPage.propTypes = {
        user: PropTypes.object.isRequired,
        onUserChanged: PropTypes.func.isRequired
    }

    return (
        <>
        </>
    )
}

export default AdminPage;
