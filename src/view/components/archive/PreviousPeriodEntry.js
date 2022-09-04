import React from 'react'
import * as PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import {MdDeleteOutline} from "react-icons/md";
import {applyIconStyle, removeIconStyle} from "../../../res/customButtonsStyle";
import {RiArrowGoBackLine} from "react-icons/ri";
import {calculateMoneyInEnvelopes} from "../../../util";

function PreviousPeriodEntry(props) {
    PreviousPeriodEntry.propTypes = {
        periodObject: PropTypes.object.isRequired,
        onPeriodActivated: PropTypes.func.isRequired,
        onPeriodRemoved: PropTypes.func.isRequired,
    }

    const archiveEntryStyle = {
        backgroundColor: 'white',

    }

    const onPeriodActivatedButtonClicked = (event) => {
        event.preventDefault()
        props.onPeriodActivated(props.periodObject)
    }

    const onPeriodRemovedButtonClicked = (event) => {
        event.preventDefault()
        props.onPeriodRemoved(props.periodObject)
    }

    return (
        <div className={'text-mono'}>
            <hr className={'my-2 mx-0'}/>
            <Row className={'d-flex align-items-center mx-1 py-1'} style={archiveEntryStyle}>
                <Col xs={4}>
                    {props.periodObject.startDate} - {props.periodObject.endDate}
                </Col>
                <Col xs={3} className={'d-flex justify-content-end'}>
                    {calculateMoneyInEnvelopes(props.periodObject.envelopes)} / {props.periodObject.availableMoney}
                </Col>
                <Col xs={2} className={'d-flex justify-content-end'}>
                    {props.periodObject.transactions.length}
                </Col>
                <Col xs={3}>
                    <div className={'d-flex justify-content-end'}>
                        <button
                            onClick={onPeriodActivatedButtonClicked}
                            className={'p-2 m-1'}
                            style={applyIconStyle}
                        >
                            <RiArrowGoBackLine size={'1.0em'}/>
                        </button>
                        <button
                            onClick={onPeriodRemovedButtonClicked}
                            className={'p-2 m-1'}
                            style={removeIconStyle}
                        >
                            <MdDeleteOutline size={'1.0em'}/>
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default PreviousPeriodEntry
