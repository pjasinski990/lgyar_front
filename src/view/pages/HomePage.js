import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React, {useState} from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form"
import Stack from "react-bootstrap/Stack";
import CurrencyInput from "react-currency-input-field";
import {makeBackendRequest} from "../../util";
import {defaultEnvelopes} from "../../res/defaultEnvelopes";
import dateFormat from "dateformat";
import * as PropTypes from "prop-types";
import ProgressBar from 'react-js-progressbar'

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

function Transaction(props) {
    Transaction.propTypes = {
        value: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired
    }

    let type;
    let value;
    const category = props.category
    if (props.value.startsWith('-')) {
        type = 'expense'
        value = props.value.substr(1)
    }
    else {
        type = 'income'
        value = props.value
    }

    return (
        <div className={`text-mono m-2 p-2 px-4 ${type === 'income' ? 'transaction-income' : 'transaction-expense'}`}>
            <Row>
                <Col xs={'5'}>
                    {props.timestamp}
                </Col>
                <Col xs={'3'}>
                    {category}
                </Col>
                <Col xs={'4'} style={{textAlign: 'right'}}>
                    {value}
                </Col>
            </Row>
        </div>
    )
}

function ActivePeriodTransactions(props) {
    const transactions = props.user.activePeriod.transactions
    if (transactions === null || transactions.length === 0) {
        return <h4 className={'mx-3'}>
            No transactions yet... Create one using the form below
        </h4>
    }
    else {
        const result = transactions.map(t =>
            <Transaction key={t.timestamp} timestamp={t.timestamp} category={t.category} value={t.balanceDifference}/>
        )
        return (
            <div>
                {result}
            </div>
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

    const envelopes = props.user.activePeriod.envelopes
    const options = envelopes.map(e => {
        return <option key={e.categoryName}>{e.categoryName}</option>
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

        console.log(transactionCategory, ' ', transactionType, ' ', transactionValue)
        const diff = transactionType === 'income'? transactionValue : '-' + transactionValue
        const now = dateFormat(new Date(), 'dd.mm.yyyy HH:MM:ss')
        const newTransaction = {category: transactionCategory, balanceDifference: diff, timestamp: now}
        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(newTransaction)
        makeBackendRequest('ap/new_transaction', 'post', body, headers)
            .then(res => {
                window.location.reload(false)
            })
    }

    return (
        <div className={'px-0 py-3'}>
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
                        style={{boxShadow: '0 0 1px red', height: '34px'}}
                        id={'transactionValueInput'}
                        disableGroupSeparators={true}
                        allowNegativeValue={false}
                        decimalScale={2}
                        placeholder={'0.00'}
                        className={'mx-1'}
                        onValueChange={handleTransactionValueChange}
                    />
                    <Button type={'submit'} className={'mx-1'}>Add</Button>
                </Stack>
            </Form>
        </div>
    )
}

function Envelope(props) {
    Envelope.propTypes = {
        envelopeName: PropTypes.string.isRequired,
        spent: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
    }

    const progress = props.limit > 0 ? props.spent * 100 / props.limit : 0
    return <ProgressBar input={progress}
                        pathColor={['#125521', 'green']}
                        shape={'arc'}
                        clockwise={false}
                        trailWidth={42}
                        pathWidth={50}
    >
        {props.envelopeName}
    </ProgressBar>
}

function EnvelopeContainer(props) {
    EnvelopeContainer.propTypes = {
        user: PropTypes.object.isRequired,
        // TODO implement variable cols
        // nCols: PropTypes.number.isRequired
    }

    let envelopes;
    if (!!props.user.activePeriod) {
        envelopes = props.user.activePeriod.envelopes.map((e) => {
            const nSpent = Number(e.spent)
            const nLimit = Number(e.limit)
            return <Envelope key={e.categoryName} envelopeName={e.categoryName} spent={nSpent} limit={nLimit}/>
        })

    let res = []
    for (let i = 0; i < envelopes.length; i += 2) {
        res.push(
            <Row>
                <Col xs={6}>{envelopes[i]}</Col>
                {i < envelopes.length - 1 && <Col>{envelopes[i+1]}</Col>}
            </Row>
        )
    }

    return <div className={'d-grid'}>{res}</div>
    }
}

function HomeLogged(props) {
    function createNewActivePeriod(event) {
        const activePeriod = props.user.activePeriod
        if (activePeriod) {
            toast.error('Finish current period first')
        }
        else {
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
                    window.location.reload(false)
                })
        }
    }

    function finishCurrentActivePeriod(event) {
        if (!props.user.activePeriod) {
            toast.error('There is no budgeting period activated')
        }
        else {
            makeBackendRequest('ap/archive', 'post', null, null)
                .then(res => {
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
                {!props.user.activePeriod &&
                    <Container className={'content-container'}>
                        <h3>
                            There is no active budgeting period
                        </h3>
                        <p>
                            Activate a budgeting period from the archive or create a new period using the button below
                        </p>
                    </Container>
                }
                {props.user.activePeriod &&
                    <Row>
                        <Col xs={8}>
                            <Container className={'content-container'}>
                                <h3 className={'mb-3 mx-2'}>Transactions</h3>
                                <ActivePeriodTransactions user={props.user}/>
                                <AddNewTransactionButton user={props.user}/>
                            </Container>
                        </Col>
                        <Col>
                            <Container id={'envelope-container'} className={'content-container'}>
                                <h3>Envelopes</h3>
                                <EnvelopeContainer user={props.user} nCols={2}/>
                            </Container>
                        </Col>
                    </Row>
                }
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
