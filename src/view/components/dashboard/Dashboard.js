import React, {useState} from "react"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TransactionContainer from "./transaction/TransactionsContainer";
import Container from "react-bootstrap/Container";
import EnvelopeContainer from "./envelope/EnvelopeContainer";

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
        const newTransactions = transactions.slice()
        newTransactions.push(newTransaction)
        setTransactions(newTransactions)
    }

    const onTransactionRemoved = (removedTransaction) => {
        const newTransactions = transactions.filter((val) => {
            return val.timestamp !== removedTransaction.timestamp
        })
        setTransactions(newTransactions)
    }

    return (
        <Row>
            <Col lg={'8'}>
                <TransactionContainer
                    transactions={transactions}
                    envelopeCategories={envelopes.map(e => e.categoryName)}
                    onTransactionAdded={onTransactionAdded}
                    onTransactionRemoved={onTransactionRemoved}
                />
            </Col>
            <Col>
                <Container id={'envelope-container'} className={'content-container'}>
                    <h3>Envelopes</h3>
                    <EnvelopeContainer envelopes={envelopes}/>
                </Container>
            </Col>
        </Row>
    )
}

export default Dashboard
