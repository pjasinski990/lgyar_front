export const getTransactionType = (transaction) => {
    return transaction.balanceDifference.startsWith('-') ? 'expense' : 'income'
}

export const getEmptyBudgetingPeriod = () => {
    return {
        envelopes: [],
        transactions: [],
        startDate: null,
        endDate: null,
        availableMoney: 0
    }
}

export const calculateMoneySpent = (category, transactions) => {
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

export const getUpdatedEnvelopes = (envelopes, transactions) => {
    const revaluedEnvelopes = envelopes.slice(0)
    for (let i = 0; i < revaluedEnvelopes.length; ++i) {
        revaluedEnvelopes[i].spent = calculateMoneySpent(revaluedEnvelopes[i].categoryName, transactions)
    }
    return revaluedEnvelopes
}

export const calculateMoneyInEnvelopes = (envelopes) => {
    return envelopes.reduce((accumulator, e) => accumulator + Number(e.limit), 0)
}
