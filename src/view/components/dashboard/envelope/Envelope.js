import * as PropTypes from "prop-types";
import ProgressBar from "react-js-progressbar";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Stack from "react-bootstrap/Stack";
import {makeBackendRequest} from "../../../../util";
import {editButtonStyle, removeButtonStyle} from "../../../../res/customButtonsStyle";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";

function Envelope(props) {
    Envelope.propTypes = {
        categoryName: PropTypes.string.isRequired,
        spent: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
        onEnvelopeEdited: PropTypes.func.isRequired,
        onEnvelopeRemoved: PropTypes.func.isRequired,
    }

    const [newLimit, setNewLimit] = useState(props.limit)

    const getCurrentAsObject = () => {
        return {categoryName: props.categoryName, spent: props.spent, limit: props.limit}
    }

    const editEnvelope = async (event) => {
        event.preventDefault()
        const target = getCurrentAsObject()
        target.limit = newLimit
        const body = JSON.stringify(target)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_envelope', 'post', body, headers)
            .then(res => {
                props.onEnvelopeEdited(target)
            })
    }

    const removeEnvelope = async (event) => {
        event.preventDefault()
        const target = getCurrentAsObject()
        props.onEnvelopeRemoved(target)
    }

    const progress = props.limit > 0 ? (props.limit - props.spent) * 100 / props.limit : 0
    return (
        <div>
            <h3 className={'mb-0'}>{props.categoryName}</h3>
            <div className={'d-flex justify-content-between align-items-center'}>
                <div>
                    <Form id='editEnvelopeForm' className={'text-mono'} onSubmit={editEnvelope}>
                        <Stack direction={'horizontal'} gap={2}>
                            <span>Limit: </span>
                            <CurrencyInput
                                style={{height: '28px', width: '50px'}}
                                id={'transactionValueInput'}
                                disableGroupSeparators={true}
                                allowNegativeValue={false}
                                decimalScale={2}
                                placeholder={props.limit}
                                onValueChange={value => setNewLimit(value)}
                            />
                            <Button
                                type={'submit'}
                                variant={'custom'}
                                size={'sm'}
                                className={'px-0'}
                                style={editButtonStyle}
                            >
                                Edit
                            </Button>
                        </Stack>
                    </Form>
                    <span className={'text-mono'}>Left: {(props.limit - props.spent).toFixed(2)}</span>
                </div>
                <Stack direction={'horizontal'}>
                    <div className={'d-flex flex-column mx-3'}>
                        <Button
                            variant={'custom'}
                            onClick={removeEnvelope}
                            size={'sm'}
                            className={'py-1'}
                            style={removeButtonStyle}
                        >
                            Remove
                        </Button>
                    </div>
                    <ProgressBar input={progress}
                                 pathColor={['#5f7838', '#556b2f']}
                                 size={'72px'}
                                 clockwise={false}
                                 trailWidth={16}
                                 pathWidth={32}>
                    </ProgressBar>
                </Stack>
            </div>
        </div>
    )
}

export default Envelope
