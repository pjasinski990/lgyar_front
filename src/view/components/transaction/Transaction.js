import * as PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {Button} from "react-bootstrap";
import {makeBackendRequest} from "../../../util";

const removeButtonStyle = {
    backgroundColor: 'crimson',
    color: 'white',
}

function Transaction(props) {
    Transaction.propTypes = {
        value: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired
    }

    const deleteTransaction = (e) => {
        console.log('deleting')
        const target = {category: props.category, balanceDifference: props.value, timestamp: props.timestamp}
        const body = JSON.stringify(target)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/remove_transaction', 'post', body, headers)
            .then(res => {
                console.log(res)
                props.onDeletedTransaction(target)
            })
    }

    let type;
    let value;
    const category = props.category
    if (props.value.startsWith('-')) {
        type = 'expense'
        value = props.value.substr(1)
    }
    else {
        type = 'income'
        value = props.value
    }

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
                <Col xs={'4'}>
                    {props.timestamp}
                </Col>
                <Col xs={'3'}>
                    {category}
                </Col>
                <Col xs={'3'} style={{textAlign: 'right'}}>
                    {value}
                </Col>
                <Col xs={'2'} className={'d-grid'}>
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
