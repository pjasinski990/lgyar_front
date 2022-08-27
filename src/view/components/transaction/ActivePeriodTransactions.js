import Transaction from "./Transaction";
import React from "react";

function ActivePeriodTransactions(props) {
    const getTransactionType = (transaction) => {
        return transaction.balanceDifference.startsWith('-') ? 'expense' : 'income'
    }

    const transactions = props.transactions
    if (transactions === null || transactions.length === 0) {
        return <h4 className={'mx-3'}>
            No transactions yet... Create one using the form below
        </h4>
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
            result.push(
                <Transaction
                    addMargin={shouldPad}
                    key={t.timestamp}
                    timestamp={t.timestamp}
                    category={t.category}
                    value={t.balanceDifference}
                    onDeletedTransaction={props.onDeletedTransaction}
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
