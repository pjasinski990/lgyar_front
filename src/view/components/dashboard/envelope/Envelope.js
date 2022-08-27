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

    console.log(props.spent, ' ', props.limit)
    const progress = props.limit > 0 ? (props.limit - props.spent) * 100 / props.limit : 0
    return (
        <div className={'d-flex justify-content-between'}>
            <div>
                <h5 style={{display: 'flex', justifyContent: 'center'}}>{props.envelopeName}</h5>
                <div className={'d-flex mb-4'} style={{justifyContent: 'between'}}>
                    <Button variant={'custom'} onClick={editEnvelope} size={'sm'} style={editButtonStyle}>Edit</Button>
                    <Button variant={'custom'} onClick={removeEnvelope} size={'sm'} style={removeButtonStyle}>Remove</Button>
                </div>
            </div>
            <ProgressBar input={progress}
                         pathColor={['#125521', 'green']}
                         size={'100px'}
                         clockwise={false}
                         trailWidth={16}
                         pathWidth={20}>
            </ProgressBar>
        </div>)
}

export default Envelope
