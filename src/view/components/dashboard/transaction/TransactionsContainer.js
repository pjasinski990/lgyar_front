import React from "react";
import Container from "react-bootstrap/Container";
import ActivePeriodTransactions from "./ActivePeriodTransactions";
import AddNewTransactionButton from "./AddNewTransactionButton";
import * as PropTypes from "prop-types";

function TransactionContainer(props) {
    TransactionContainer.propTypes = {
        transactions: PropTypes.array.isRequired,
        envelopeCategories: PropTypes.array.isRequired,
        onTransactionAdded: PropTypes.func.isRequired,
        onTransactionRemoved: PropTypes.func.isRequired,
    }

    return (
        <Container className={'content-container'}>
            <h3 className={'mb-3 mx-2'}>Transactions</h3>
            <ActivePeriodTransactions
                user={props.user}
                transactions={props.transactions}
                onTransactionAdded={props.onTransactionAdded}
                onTransactionRemoved={props.onTransactionRemoved}
            />
            <AddNewTransactionButton
                user={props.user}
                envelopeCategories={props.envelopeCategories}
                onTransactionAdded={props.onTransactionAdded}
            />
        </Container>
    )
}

export default TransactionContainer
