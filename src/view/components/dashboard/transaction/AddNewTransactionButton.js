import React, {useState} from "react";
import {toast} from "react-toastify";
import dateFormat from "dateformat";
import {makeBackendRequest} from "../../../../util";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import CurrencyInput from "react-currency-input-field";
import Button from "react-bootstrap/Button";
import * as PropTypes from "prop-types";

function AddNewTransactionButton(props) {
    AddNewTransactionButton.propTypes = {
        envelopeCategories: PropTypes.array.isRequired,
        onTransactionAdded: PropTypes.func.isRequired
    }

    const [transactionCategory, setSelectedTransactionCategory] = useState('')
    const [transactionType, setSelectedTransactionType] = useState('expense')
    const [transactionValue, setSelectedTransactionValue] = useState('')

    const handleTransactionCategoryChange = event => {
        setSelectedTransactionCategory(event.target.value)
    }
    const handleTransactionTypeChange = event => {
        setSelectedTransactionType(event.target.value)
        updateTransactionValueBorder(event.target.value)
    }
    const handleTransactionValueChange = (value) => {
        setSelectedTransactionValue(value)
    }

    const updateTransactionValueBorder = (transactionType) => {
        const valueField = document.getElementById('transactionValueInput')
        if (transactionType === 'income') {
            valueField.style.boxShadow = '0 0 1px green'
        }
        else if (transactionType === 'expense') {
            valueField.style.boxShadow = '0 0 1px red'
        }
    }

    const options = props.envelopeCategories.map(e => {
        return <option key={e}>{e}</option>
    })

    const addTransaction = e => {
        e.preventDefault()
        if (transactionCategory === '') {
            toast.error('Select an envelope for this transaction')
            return
        }
        else if (transactionValue === '') {
            toast.error('Input a value for this transaction')
            return
        }

        // TODO guard against using the same id

        const diff = transactionType === 'income'? transactionValue : '-' + transactionValue
        const now = dateFormat(new Date(), 'dd.mm.yyyy HH:MM:ss')
        const newTransaction = {category: transactionCategory, balanceDifference: diff, timestamp: now}
        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(newTransaction)
        makeBackendRequest('ap/add_transaction', 'post', body, headers)
            .then(res => {
                res.json()
                    .then(newTransaction => {
                        props.onTransactionAdded(newTransaction)
                    })
            })
    }

    return (
        <div className={'px-0 mt-1 mb-2'}>
            <Form id={'transactionForm'} className={'text-mono'} onSubmit={addTransaction}>
                <Stack direction={'horizontal'} gap={2} className={'mx-1'}>
                    <Form.Select value={transactionCategory} onChange={handleTransactionCategoryChange}>
                        <option disabled={true} value={''}>Choose the envelope</option>
                        {options}
                    </Form.Select>
                    <Form.Select value={transactionType} onChange={handleTransactionTypeChange}>
                        <option value={'expense'}>Expense</option>
                        <option value={'income'}>Income</option>
                    </Form.Select>
                    <CurrencyInput
                        style={{boxShadow: '0 0 1px red', height: '34px'}}
                        id={'transactionValueInput'}
                        disableGroupSeparators={true}
                        allowNegativeValue={false}
                        decimalScale={2}
                        placeholder={'Value'}
                        onValueChange={handleTransactionValueChange}
                    />
                    <Button type={'submit'}>Add</Button>
                </Stack>
            </Form>
        </div>
    )
}

export default AddNewTransactionButton
