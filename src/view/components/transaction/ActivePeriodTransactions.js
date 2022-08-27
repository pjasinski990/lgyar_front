import Transaction from "./Transaction";
import React from "react";
import {getTransactionType} from "../../../util";

function ActivePeriodTransactions(props) {
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
                    key={t.timestamp}
                    transactionObject={t}
                    addMargin={shouldPad}
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
