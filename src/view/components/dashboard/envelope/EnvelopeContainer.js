import * as PropTypes from "prop-types";
import Envelope from "./Envelope";
import React from "react";

function EnvelopeContainer(props) {
    EnvelopeContainer.propTypes = {
        envelopes: PropTypes.array.isRequired,
        onEnvelopeEdited: PropTypes.func.isRequired,
        onEnvelopeRemoved: PropTypes.func.isRequired,
    }

    let envelopes;
    if (!!props.envelopes) {
        envelopes = props.envelopes.map(e => {
            const nSpent = Number(e.spent)
            const nLimit = Number(e.limit)
            return (
                <div key={e.categoryName}>
                    <Envelope
                        categoryName={e.categoryName}
                        spent={nSpent}
                        limit={nLimit}
                        onEnvelopeEdited={props.onEnvelopeEdited}
                        onEnvelopeRemoved={props.onEnvelopeRemoved}
                    />
                    <hr className={'my-2'}/>
                </div>
            )
        })
        return <div>{envelopes}</div>
    }
}

export default EnvelopeContainer
