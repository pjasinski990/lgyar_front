import * as PropTypes from "prop-types";
import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import CurrencyInput from "react-currency-input-field";
import Button from "react-bootstrap/Button";
import {makeBackendRequest} from "../../../../util";

function AddNewEnvelopeButton(props) {
    AddNewEnvelopeButton.propTypes = {
        onEnvelopeAdded: PropTypes.func.isRequired
    }

    const [categoryName, setCategoryName] = useState('')
    const [limit, setLimit] = useState(0)

    const handleCategoryNameChange = event => {
        if (event.target.value.length > 16) {
            event.target.value = event.target.value.substring(0, 16)
        }
        setCategoryName(event.target.value)
    }

    const handleLimitChange = value => {
        setLimit(value)
    }

    const addEnvelope = (event) => {
        event.preventDefault()
        const newEnvelope = {categoryName: categoryName, spent: '0', limit: limit}

        // TODO clear currency input too
        document.getElementById('envelopeForm').reset()
        setCategoryName('')

        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(newEnvelope)
        makeBackendRequest('ap/add_envelope', 'post', body, headers)
            .then(res => {
                res.json()
                    .then(newEnvelope => {
                        props.onEnvelopeAdded(newEnvelope)
                    })
            })
    }

    return (
        <>
            <Form id='envelopeForm' className={'text-mono'} onSubmit={addEnvelope}>
                <Stack direction={'horizontal'} gap={2}>
                    <Form.Control placeholder={'Category'} onChange={handleCategoryNameChange}/>
                    <CurrencyInput
                        style={{height: '36px', width: '100px'}}
                        id={'transactionValueInput'}
                        disableGroupSeparators={true}
                        allowNegativeValue={false}
                        decimalScale={2}
                        placeholder={'Limit'}
                        onValueChange={handleLimitChange}
                    />
                    <Button type={'submit'}>Add</Button>
                </Stack>
            </Form>
        </>
    )
}

export default AddNewEnvelopeButton
