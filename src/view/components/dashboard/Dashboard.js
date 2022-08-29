import React, {useState} from "react"
import Row from "react-bootstrap/Row";
import {toast} from "react-toastify";
import Col from "react-bootstrap/Col";
import TransactionContainer from "./transaction/TransactionsContainer";
import Container from "react-bootstrap/Container";
import EnvelopeContainer from "./envelope/EnvelopeContainer";
import NewEnvelopeButton from "./envelope/NewEnvelopeButton";
import {makeBackendRequest} from "../../../util";

const calculateMoneySpent = (category, transactions) => {
    if (!transactions || transactions.length === 0) {
        return 0
    }

    const relatingTransactions = transactions.filter(t => t.category === category)
    let acc = 0
    for (const t of relatingTransactions) {
        acc += Number(t.balanceDifference)
    }
    return -acc
}

const getUpdatedEnvelopes = (envelopes, transactions) => {
    const revaluedEnvelopes = envelopes.splice(0)
    for (let i = 0; i < revaluedEnvelopes.length; ++i) {
        revaluedEnvelopes[i].spent = calculateMoneySpent(revaluedEnvelopes[i].categoryName, transactions)
    }
    return revaluedEnvelopes
}

function Dashboard(props) {
    const [transactions, setTransactions] = useState(props.user.activePeriod.transactions)
    const [envelopes, setEnvelopes] = useState(getUpdatedEnvelopes(props.user.activePeriod.envelopes, props.user.activePeriod.transactions))

    const onTransactionAdded = (newTransaction) => {
        const newTransactions = [...transactions, newTransaction]
        setTransactions(newTransactions)

        const newEnvelopes = envelopes.slice()
        const env = newEnvelopes.find(e => e.categoryName === newTransaction.category)
        env.spent -= Number(newTransaction.balanceDifference)
        setEnvelopes(newEnvelopes)
    }

    const onTransactionRemoved = (removedTransaction) => {
        const newTransactions = transactions.filter((val) => {
            return val.timestamp !== removedTransaction.timestamp
        })
        setTransactions(newTransactions)

        const newEnvelopes = envelopes.slice()
        const env = newEnvelopes.find(e => e.categoryName === removedTransaction.category)
        env.spent += Number(removedTransaction.balanceDifference)
        setEnvelopes(newEnvelopes)
    }

    const onEnvelopeAdded = (envelope) => {
        if (!!envelopes.find(e => e.categoryName === envelope.categoryName)) {
            toast.error('Envelope with this name already exists')
            return
        }

        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(envelope)
        makeBackendRequest('ap/add_envelope', 'post', body, headers)
            .then(res => {
                res.json()
                    .then(newEnvelope => {
                        const newEnvelopes = [...envelopes, newEnvelope]
                        setEnvelopes(newEnvelopes)
                    })
            })
    }

    const onEnvelopeEdited = (envelope) => {
        const targetIndex = envelopes.findIndex(e => e.categoryName === envelope.categoryName)
        setEnvelopes([...envelopes.splice(0, targetIndex), envelope, ...envelopes.splice(targetIndex + 1)])
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
                const newEnvelopes = envelopes.filter((val) => {
                    return val.categoryName !== envelope.categoryName
                })
                setEnvelopes(newEnvelopes)
            })
    }

    return (
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
                    <h3 className={'mb-3'}>Envelopes</h3>
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
    )
}

export default Dashboard
