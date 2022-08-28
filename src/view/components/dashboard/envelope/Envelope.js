import * as PropTypes from "prop-types";
import ProgressBar from "react-js-progressbar";
import Button from "react-bootstrap/Button";
import React from "react";
import Stack from "react-bootstrap/Stack";
import {makeBackendRequest} from "../../../../util";

const editButtonStyle = {
    flex: '1 0 40%',
    backgroundColor: 'orange',
}

const removeButtonStyle = {
    flex: '1 0 40%',
    backgroundColor: 'crimson',
    color: 'white'
}

function Envelope(props) {
    Envelope.propTypes = {
        categoryName: PropTypes.string.isRequired,
        spent: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
        onEnvelopeEdited: PropTypes.func.isRequired,
        onEnvelopeRemoved: PropTypes.func.isRequired,
    }

    const getCurrentAsObject = () => {
        return {categoryName: props.categoryName, spent: props.spent, limit: props.limit}
    }

    const editEnvelope = async (e) => {
        props.onEnvelopeEdited(getCurrentAsObject())
    }

    const removeEnvelope = async (e) => {
        props.onEnvelopeRemoved(getCurrentAsObject())
        const target = getCurrentAsObject()
        const body = JSON.stringify(target)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/remove_envelope', 'post', body, headers)
            .then(res => {
                props.onEnvelopeRemoved(target)
            })
    }

    const progress = props.limit > 0 ? (props.limit - props.spent) * 100 / props.limit : 0
    return (
        <div className={'d-flex justify-content-between align-items-center'}>
            <div>
                <h4>{props.categoryName}</h4>
                <span className={'text-mono'}>Money left: {props.limit - props.spent}</span>
            </div>
            <Stack direction={'horizontal'}>
                <div className={'d-flex flex-column mx-3'}>
                    <Button variant={'custom'} onClick={editEnvelope} size={'sm'} style={editButtonStyle}>Edit</Button>
                    <Button variant={'custom'} onClick={removeEnvelope} size={'sm'} style={removeButtonStyle}>Remove</Button>
                </div>
                <ProgressBar input={progress}
                             pathColor={['#125521', 'green']}
                             size={'80px'}
                             clockwise={false}
                             trailWidth={16}
                             pathWidth={20}>
                </ProgressBar>
            </Stack>
        </div>)
}

export default Envelope
