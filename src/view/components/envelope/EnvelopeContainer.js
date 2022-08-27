import * as PropTypes from "prop-types";
import Envelope from "./Envelope";
import React from "react";

function EnvelopeContainer(props) {
    EnvelopeContainer.propTypes = {
        user: PropTypes.object.isRequired,
    }

    let envelopes;
    if (!!props.user.activePeriod) {
        envelopes = props.user.activePeriod.envelopes.map((e) => {
            const nSpent = Number(e.spent)
            const nLimit = Number(e.limit)
            return <Envelope key={e.categoryName} envelopeName={e.categoryName} spent={nSpent} limit={nLimit}/>
        })
        return <div className={'d-grid mt-4'}>{envelopes}</div>
    }
}

export default EnvelopeContainer
