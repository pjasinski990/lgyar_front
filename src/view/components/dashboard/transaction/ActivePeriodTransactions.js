import Transaction from "./Transaction";
import React from "react";
import {getTransactionType} from "../../../../util";
import * as PropTypes from "prop-types";

function ActivePeriodTransactions(props) {
    ActivePeriodTransactions.propTypes = {
        transactions: PropTypes.array.isRequired,
        onTransactionAdded: PropTypes.func.isRequired,
        onTransactionRemoved: PropTypes.func.isRequired,
    }

    const transactions = props.transactions
    if (transactions === null || transactions.length === 0) {
        return (
            <h5 className={'m-3'}>
                No transactions yet... Create one using the form above
            </h5>
        )
    }
    else {
        let result = []
        let lastType = getTransactionType(transactions[0])
        for (let i = 0; i < transactions.length; ++i) {
            let shouldPad = false
            const t = transactions[i]
            const type = getTransactionType(t)
            if (lastType !== type) {
                shouldPad = true
            }
            lastType = type
            result.unshift(
                <Transaction
                    key={t.timestamp}
                    transactionObject={t}
                    addMargin={shouldPad}
                    onTransactionRemoved={props.onTransactionRemoved}
                />
            )
        }
        return (
            <div>
                {result}
            </div>
        )
    }
}

export default ActivePeriodTransactions
