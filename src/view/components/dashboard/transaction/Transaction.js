import * as PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {Button} from "react-bootstrap";
import {getTransactionType} from "../../../../util";
import {removeButtonStyle} from "../../../../res/customButtonsStyle";

function Transaction(props) {
    Transaction.propTypes = {
        transactionObject: PropTypes.object.isRequired,
        onTransactionRemoved: PropTypes.func.isRequired
    }

    const removeTransaction = (e) => {
        const target = props.transactionObject
        props.onTransactionRemoved(target)
    }

    const type = getTransactionType(props.transactionObject)
    return (
        <div className={`
            text-mono 
            mx-1 
            py-2 
            px-4 
            ${type === 'income' ? 'transaction-income' : 'transaction-expense'}
            ${props.addMargin ? 'mb-2' : ''}
        `}>
            <Row className={'align-items-center'}>
                <Col xs={'4'} md={'5'}>
                    {props.transactionObject.timestamp}
                </Col>
                <Col xs={'5'} md={'3'}>
                    {props.transactionObject.category}
                </Col>
                <Col xs={'3'} md={'2'} style={{textAlign: 'right'}}>
                    {props.transactionObject.balanceDifference}
                </Col>
                <Col md={'2'} className={'d-grid'}>
                    <Button
                        variant={'custom'}
                        style={removeButtonStyle}
                        block={'true'}
                        className={'py-1'}
                        onClick={removeTransaction}
                    >
                        Remove
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default Transaction
