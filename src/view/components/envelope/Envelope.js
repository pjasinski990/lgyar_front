import * as PropTypes from "prop-types";
import ProgressBar from "react-js-progressbar";
import Button from "react-bootstrap/Button";
import React from "react";

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
        envelopeName: PropTypes.string.isRequired,
        spent: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
    }

    const editEnvelope = async (e) => {
        console.log(e.target)
    }

    const removeEnvelope = async (e) => {
        console.log(e.target.value)
    }

    const progress = props.limit > 0 ? props.spent * 100 / props.limit : 0
    return (
        <div className={'d-flex'}>
            <ProgressBar input={progress}
                         pathColor={['#125521', 'green']}
                         shape={'arc'}
                         clockwise={false}
                         trailWidth={16}
                         pathWidth={20}>
            </ProgressBar>
            <div>
                <h5 style={{display: 'flex', justifyContent: 'center'}}>{props.envelopeName}</h5>
                <div className={'d-flex mb-4'} style={{justifyContent: 'between'}}>
                    <Button variant={'custom'} onClick={editEnvelope} size={'sm'} style={editButtonStyle}>Edit</Button>
                    <Button variant={'custom'} onClick={removeEnvelope} size={'sm'} style={removeButtonStyle}>Remove</Button>
                </div>
            </div>
        </div>)
}

export default Envelope
