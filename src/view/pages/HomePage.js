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
    const transactions = props.user.activePeriod
    if (transactions === null) {
        return <Container className={'content-container'}>
            No transactions yet... Create one using the button below
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
    const [selectedTransactionCategory, setSelectedTransactionCategory] = useState('')
    const handleTransactionCategoryChange = e => {
        console.log('Label: ', e.target.selectedOptions[0].label)
        console.log(e.target.value)
        setSelectedTransactionCategory(e.target.value)
    }
    const addTransaction = e => {
        console.log(e)
        console.log(selectedTransactionCategory)
    }

    const [selectedTransactionType, setSelectedTransactionType] = useState('')
    const handleTransactionTypeChange = e => {
        console.log('Label: ', e.target.selectedOptions[0].label)
        console.log(e.target.value)
        setSelectedTransactionType(e.target.value)

        const valueField = document.getElementById('transactionValueInput')
        if (e.target.value === 'income') {
            valueField.style.boxShadow = '0 0 3px green'
        }
        else if (e.target.value === 'expense') {
            valueField.style.boxShadow = '0 0 3px red'
        }
    }

    if (props.user.activePeriod === null) {
        return <Container className={'content-container'}>
            <h3>
                There is no active budgeting period
            </h3>
            <p>
                Activate a budgeting period from the archive or create a new period using the button below.
            </p>
        </Container>
    }
    const envelopes = props.user.activePeriod.envelopes
    const options = envelopes.map(e => <option>{e.categoryName}</option>)

    return (
        <Container className={'content-container'}>
            <Stack direction={'horizontal'}>
                <InputGroup className={'text-mono'}>
                    <Form.Select value={selectedTransactionCategory} onChange={handleTransactionCategoryChange} className={'mx-1'}>
                        <option disabled={true} value={''}>Choose the envelope</option>
                        {options}
                    </Form.Select>
                    <Form.Select value={selectedTransactionType} onChange={handleTransactionTypeChange} className={'mx-1'}>
                        <option value={'income'}>Income</option>
                        <option value={'expense'}>Expense</option>
                    </Form.Select>
                    <CurrencyInput
                        id={'transactionValueInput'}
                        disableGroupSeparators={true}
                        placeholder={'$0.00'}
                        prefix={'$'}
                        onValueChange={(name, value) => console.log(value, name)}
                        className={'mx-1'}
                    />
                    <Button onClick={addTransaction} className={'mx-1'}>Add</Button>
                </InputGroup>
            </Stack>
        </Container>
    )
}

function HomeLogged(props) {
    function createNewActivePeriod(e) {
        const activePeriod = props.user.activePeriod
        if (activePeriod) {
            toast.error('Finish current period first')
        }
        else {
            const body = JSON.stringify([{'categoryName': 'food', 'limit': '1000', 'spent': '0'}])
            console.log(body)
            const headers = {'Content-Type': 'application/JSON'}
            makeBackendRequest('ap/create', 'post', body, headers)
                .then(res => {
                        console.log(res)
                        res.json()
                            .then(data => console.log(data))
                    }
                )
        }
    }

    const activePeriod = props.user.activePeriod
    let tooltip = ''
    if (!activePeriod) {
        tooltip = 'NO ACTIVE PERIOD'
    }
    else {
        tooltip = activePeriod.startDate + ' ' + activePeriod.endDate
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
                            <Button block={'true'}>Finish current period</Button>
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
