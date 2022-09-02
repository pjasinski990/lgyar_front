import * as PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {getTransactionType} from "../../../../util";
import {removeIconStyle} from "../../../../res/customButtonsStyle";
import {MdDeleteOutline} from "react-icons/md";

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
                <Col xs={'4'} md={'3'}>
                    {props.transactionObject.category}
                </Col>
                <Col xs={'3'} md={'3'} style={{textAlign: 'right'}}>
                    {props.transactionObject.balanceDifference}
                </Col>
                <Col xs={'1'} md={'1'} className={'d-flex justify-content-end'}>
                    <button
                        style={removeIconStyle}
                        onClick={removeTransaction}
                    >
                        <MdDeleteOutline size={'1.1em'}/>
                    </button>
                </Col>
            </Row>
        </div>
    )
}

export default Transaction
