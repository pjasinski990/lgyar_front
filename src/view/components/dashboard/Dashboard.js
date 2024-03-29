import React, {useState} from "react"
import Row from "react-bootstrap/Row";
import {toast} from "react-toastify";
import Col from "react-bootstrap/Col";
import TransactionContainer from "./transaction/TransactionsContainer";
import Container from "react-bootstrap/Container";
import EnvelopeContainer from "./envelope/EnvelopeContainer";
import NewEnvelopeButton from "./envelope/NewEnvelopeButton";
import {calculateMoneyInEnvelopes, getUpdatedEnvelopes} from "../../../util";
import DashboardHeader from "./dashboard_header/DashboardHeader";
import {
    makeBackendRequest,
    sessionGetActivePeriod, sessionSetAvailableMoney,
    sessionSetEnvelopes,
    sessionSetTransactions
} from "../../../backendUtil";

function Dashboard(props) {
    const [transactions, setTransactions] = useState(sessionGetActivePeriod().transactions)
    const [envelopes, setEnvelopes] = useState(getUpdatedEnvelopes(sessionGetActivePeriod().envelopes, transactions))
    const [availableMoney, setAvailableMoney] = useState(sessionGetActivePeriod().availableMoney)
    const [unassignedMoney, setUnassignedMoney] = useState(sessionGetActivePeriod().availableMoney - calculateMoneyInEnvelopes(envelopes))

    const onTransactionAdded = (newTransaction) => {
        if (transactions.find(t => t.timestamp === newTransaction.timestamp)) {
            toast.error('Slow down a little...')
            return
        }
        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(newTransaction)
        makeBackendRequest('ap/add_transaction', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(newTransaction => {
                            const newTransactions = [...transactions, newTransaction]
                            setTransactions(newTransactions)
                            sessionSetTransactions(newTransactions)

                            const i = envelopes.findIndex(e => e.categoryName === newTransaction.category)
                            const updatedEnvelope = envelopes[i]
                            updatedEnvelope.spent -= Number(newTransaction.balanceDifference)
                            const newEnvelopes = ([...envelopes.slice(0, i), updatedEnvelope, ...envelopes.slice(i + 1)])
                            setEnvelopes(newEnvelopes)
                            sessionSetEnvelopes(newEnvelopes)
                        })
                }
            })
    }

    const onTransactionRemoved = (removedTransaction) => {
        const body = JSON.stringify(removedTransaction)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/remove_transaction', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    const newTransactions = transactions.filter((val) => {
                        return val.timestamp !== removedTransaction.timestamp
                    })
                    setTransactions(newTransactions)
                    sessionSetTransactions(newTransactions)

                    const i = envelopes.findIndex(e => e.categoryName === removedTransaction.category)
                    const updatedEnvelope = envelopes[i]
                    updatedEnvelope.spent += Number(removedTransaction.balanceDifference)
                    const newEnvelopes = ([...envelopes.slice(0, i), updatedEnvelope, ...envelopes.slice(i + 1)])
                    setEnvelopes(newEnvelopes)
                    sessionSetEnvelopes(newEnvelopes)
                }
            })
    }

    const onEnvelopeAdded = (envelope) => {
        // TODO validate in backend
        if (!!envelopes.find(e => e.categoryName === envelope.categoryName)) {
            toast.error('Envelope with this name already exists')
            return
        }

        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(envelope)
        makeBackendRequest('ap/add_envelope', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(newEnvelope => {
                            const newEnvelopes = [...envelopes, newEnvelope]
                            setEnvelopes(newEnvelopes)
                            sessionSetEnvelopes(newEnvelopes)
                            setUnassignedMoney(availableMoney - calculateMoneyInEnvelopes(newEnvelopes))
                        })
                }
            })
    }

    const onEnvelopeEdited = (envelope) => {
        const body = JSON.stringify(envelope)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_envelope', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    const targetIndex = envelopes.findIndex(e => e.categoryName === envelope.categoryName)
                    const newEnvelopes = ([...envelopes.slice(0, targetIndex), envelope, ...envelopes.slice(targetIndex + 1)])
                    setEnvelopes(newEnvelopes)
                    sessionSetEnvelopes(newEnvelopes)
                    setUnassignedMoney(availableMoney - calculateMoneyInEnvelopes(newEnvelopes))
                }
            })
    }

    const onEnvelopeRemoved = (envelope) => {
        if (!!transactions.find(t => t.category === envelope.categoryName)) {
            toast.error('This envelope contains transactions. Remove those first.')
            return
        }
        const body = JSON.stringify(envelope)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/remove_envelope', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    const newEnvelopes = envelopes.filter((val) => {
                        return val.categoryName !== envelope.categoryName
                    })
                    setEnvelopes(newEnvelopes)
                    sessionSetEnvelopes(newEnvelopes)
                    setUnassignedMoney(availableMoney - calculateMoneyInEnvelopes(newEnvelopes))
                }
            })
    }

    const onAvailableMoneyChanged = (newValue) => {
        const body = JSON.stringify(newValue)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_available_money', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(newTransaction => {
                            setAvailableMoney(newValue)
                            sessionSetAvailableMoney(newValue)
                            setUnassignedMoney(newValue - calculateMoneyInEnvelopes(envelopes))
                        })
                }
            })
    }

    return (
        <>
        <DashboardHeader
            activePeriodRange={{startDate: sessionGetActivePeriod().startDate, endDate: sessionGetActivePeriod().endDate}}
            availableMoney={availableMoney}
            onAvailableMoneyChanged={onAvailableMoneyChanged}
        />
        <Row>
            <Col xl={'7'}>
                    <TransactionContainer
                        transactions={transactions}
                        envelopeCategories={envelopes.map(e => e.categoryName)}
                        onTransactionAdded={onTransactionAdded}
                        onTransactionRemoved={onTransactionRemoved}
                    />
                </Col>
                <Col xl={'5'}>
                    <Container id={'envelope-container'} className={'content-container'}>
                        <div className={'d-flex justify-content-between align-items-baseline'}>
                            <h3 className={'mb-3'}>Envelopes</h3>
                            {unassignedMoney > 0 &&
                                <span
                                className={'text-mono'}
                                style={{color: 'green'}}
                                >to assign: <b>{unassignedMoney}</b></span>
                            }
                            {unassignedMoney < 0 &&
                                <span
                                    className={'text-mono'}
                                    style={{color: 'red'}}
                                >to assign: <b>{unassignedMoney}</b></span>
                            }
                        </div>
                        <hr className={'mb-2'}/>
                        <NewEnvelopeButton
                            onEnvelopeAdded={onEnvelopeAdded}
                        />
                        <hr className={'my-2'}/>
                        <EnvelopeContainer
                            envelopes={envelopes}
                            onEnvelopeEdited={onEnvelopeEdited}
                            onEnvelopeRemoved={onEnvelopeRemoved}
                        />
                    </Container>
                </Col>
            </Row>
        </>
    )
}

export default Dashboard
