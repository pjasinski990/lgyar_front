import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ActivePeriodTransactions from "./ActivePeriodTransactions";
import AddNewTransactionButton from "./AddNewTransactionButton";
import {makeBackendRequest} from "../../../util";


function TransactionContainer(props) {
    TransactionContainer.propTypes = {
        // value: PropTypes.string.isRequired,
    }

    let [transactions, setTransactions] = useState(props.user.activePeriod.transactions)

    const onAddedTransaction = (newTransaction) => {
        const newTransactions = transactions.slice()
        newTransactions.push(newTransaction)
        setTransactions(newTransactions)
    }

    const onDeletedTransaction = (deletedTransaction) => {
        const newTransactions = transactions.filter((val) => {
            return val.timestamp !== deletedTransaction.timestamp
        })
        setTransactions(newTransactions)
    }

    return (
        <Container className={'content-container'}>
            <h3 className={'mb-3 mx-2'}>Transactions</h3>
            <ActivePeriodTransactions
                user={props.user}
                transactions={transactions}
                onDeletedTransaction={onDeletedTransaction}
            />
            <AddNewTransactionButton
                user={props.user}
                onAddedTransaction={onAddedTransaction}
            />
        </Container>
    )
}

export default TransactionContainer
