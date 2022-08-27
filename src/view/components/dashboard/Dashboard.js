import React, {useState} from "react"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TransactionContainer from "./transaction/TransactionsContainer";
import Container from "react-bootstrap/Container";
import EnvelopeContainer from "./envelope/EnvelopeContainer";

function Dashboard(props) {
    const [transactions, setTransactions] = useState(props.user.activePeriod.transactions)
    const [envelopes, setEnvelopes] = useState(props.user.activePeriod.envelopes)

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
                    <EnvelopeContainer user={props.user}/>
                </Container>
            </Col>
        </Row>
    )
}

export default Dashboard
