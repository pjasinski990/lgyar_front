import * as PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {Button} from "react-bootstrap";
import {getTransactionType, makeBackendRequest} from "../../../../util";

const removeButtonStyle = {
    backgroundColor: 'crimson',
    color: 'white',
}

function Transaction(props) {
    Transaction.propTypes = {
        transactionObject: PropTypes.object.isRequired,
        onTransactionRemoved: PropTypes.func.isRequired
    }

    const deleteTransaction = (e) => {
        const target = props.transactionObject
        const body = JSON.stringify(target)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/remove_transaction', 'post', body, headers)
            .then(res => {
                props.onTransactionRemoved(target)
            })
    }

    const type = getTransactionType(props.transactionObject)
    return (
        <div className={`
            text-mono 
            mx-1 
            py-2 
            px-4 
            ${type === 'income' ? 'transaction-income' : 'transaction-expense'}
            ${props.addMargin ? 'mt-2' : ''}
        `}>
            <Row className={'align-items-center'}>
                <Col xs={'5'} md={'5'}>
                    {props.transactionObject.timestamp}
                </Col>
                <Col xs={'4'} md={'3'}>
                    {props.transactionObject.category}
                </Col>
                <Col xs={'2'} md={'2'} style={{textAlign: 'right'}}>
                    {props.transactionObject.balanceDifference}
                </Col>
                <Col md={'2'} className={'d-grid'}>
                    <Button
                        variant={'custom'}
                        style={removeButtonStyle}
                        block={'true'}
                        className={'py-1'}
                        onClick={deleteTransaction}
                    >
                        Remove
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default Transaction
