import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React, {useState} from "react";
import {Container, InputGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form"
import Stack from "react-bootstrap/Stack";
import CurrencyInput from "react-currency-input-field";
import {makeBackendRequest} from "../../util";
import {defaultEnvelopes} from "../../res/defaultEnvelopes";

function HomeNonLogged(props) {
    return (
        <>
            <Container className={'content-container'}>
                <h1>Welcome!</h1>
                <h5>Please <Link to={'../login'}>log in</Link> to get started.</h5>
            </Container>
        </>
    )
}

function ActivePeriodTransactions(props) {
    const transactions = props.user.activePeriod.transactions
    if (transactions === null || transactions.length === 0) {
        return <Container className={'content-container'}>
            No transactions yet... Create one using the form below
        </Container>
    }
    else {
        const result = transactions.map(t => <p>{t}</p>)
        return (
            <Container className={'content-container'}>
                {result}
            </Container>
        )
    }
}

function AddNewTransactionButton(props) {
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
    const handleTransactionValueChange = event => {
        setSelectedTransactionValue(event.target.value)
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

    if (props.user.activePeriod === null) {
        return <Container className={'content-container'}>
            <h3>
                There is no active budgeting period
            </h3>
            <p>
                Activate a budgeting period from the archive or create a new period using the button below
            </p>
        </Container>
    }
    const envelopes = props.user.activePeriod.envelopes
    const options = envelopes.map(e => {
        return <option key={e.categoryName}>{e.categoryName}</option>
    })

    const addTransaction = e => {
        e.preventDefault()
        if (transactionCategory === '') {
            toast.error('Select an envelope for this transaction')
        }
        else if (transactionValue === '') {
            toast.error('Input a value for this transaction')
        }
    }

    return (
        <Container className={'content-container'}>
            <Form className={'text-mono'} onSubmit={addTransaction}>
                <Stack direction={'horizontal'}>
                    <Form.Select value={transactionCategory} onChange={handleTransactionCategoryChange} className={'mx-1'}>
                        <option disabled={true} value={''}>Choose the envelope</option>
                        {options}
                    </Form.Select>
                    <Form.Select value={transactionType} onChange={handleTransactionTypeChange} className={'mx-1'}>
                        <option value={'expense'}>Expense</option>
                        <option value={'income'}>Income</option>
                    </Form.Select>
                    <CurrencyInput
                        style={{boxShadow: '0 0 1px red'}}
                        id={'transactionValueInput'}
                        disableGroupSeparators={true}
                        placeholder={'$0.00'}
                        className={'mx-1'}
                        onChange={handleTransactionValueChange}
                    />
                    <Button type={'submit'} className={'mx-1'}>Add</Button>
                </Stack>
            </Form>
        </Container>
    )
}

function HomeLogged(props) {
    function createNewActivePeriod(event) {
        const activePeriod = props.user.activePeriod
        if (activePeriod) {
            toast.error('Finish current period first')
        }
        else {
            // const body = JSON.stringify([{'categoryName': 'food', 'limit': '1000', 'spent': '0'}])
            const headers = {'Content-Type': 'application/JSON'}
            let body
            if (props.user.previousPeriods.length > 0) {
                const previousPeriods = props.user.previousPeriods
                const lastEnvelopes = previousPeriods[previousPeriods.length - 1].envelopes
                const lastEnvelopesCleaned = lastEnvelopes.map((e) => { e.limit = 0; e.spent = 0; return e })
                body = JSON.stringify(lastEnvelopesCleaned)
            }
            else {
                body = JSON.stringify(defaultEnvelopes)
            }
            makeBackendRequest('ap/create', 'post', body, headers)
                .then(res => {
                        console.log(res)
                        res.json()
                            .then(data => {
                                console.log(data)
                                window.location.reload(false)
                            })
                    }
                )
        }
    }

    function finishCurrentActivePeriod(event) {
        if (!props.user.activePeriod) {
            toast.error('There is no budgeting period activated')
        }
        else {
            makeBackendRequest('ap/archive', 'post', null, null)
                .then(res => {
                    console.log(res)
                    window.location.reload(false)
                })
        }
    }

    const activePeriod = props.user.activePeriod
    let tooltip = ''
    if (!activePeriod) {
        tooltip = 'NO ACTIVE PERIOD'
    }
    else {
        tooltip = activePeriod.startDate + '  -  ' + activePeriod.endDate
    }

    return (
        <>
            <h1 className={'pt-3 text-mono'} style={{display: 'flex', justifyContent: 'center'}}>{tooltip}</h1>
            <Container className={'d-grid'}>
                <Row>
                    <Col xs={8}>
                        {props.user.activePeriod && <ActivePeriodTransactions user={props.user}/>}
                        <AddNewTransactionButton user={props.user}/>
                    </Col>
                    <Col>
                        <Container className={'content-container'}>
                            <h1>Hello world!</h1>
                            <p>Add envelope icons here</p>
                        </Container>
                    </Col>
                </Row>
                <Row className={'px-1 mt-3'}>
                    <Col xs={6} className={'px-0'}>
                        <div className={'m-2 d-grid px-0'}>
                            <Button onClick={createNewActivePeriod} block={'true'} variant={'secondary'}>Create new period</Button>
                        </div>
                    </Col>
                    <Col xs={6} className={'px-0'}>
                        <div className={'m-2 d-grid px-0'}>
                            <Button onClick={finishCurrentActivePeriod} block={'true'}>Finish current period</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

function HomePage(props) {
    if (props.user.logged) {
        return HomeLogged(props)
    }
    else {
        return HomeNonLogged(props)
    }
}

export default HomePage
