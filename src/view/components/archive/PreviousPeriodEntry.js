import React from 'react'
import * as PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import {MdDeleteOutline, MdOpenInFull} from "react-icons/md";
import {applyIconStyle, removeIconStyle} from "../../../res/customButtonsStyle";

function PreviousPeriodEntry(props) {
    PreviousPeriodEntry.propTypes = {
        periodObject: PropTypes.object.isRequired,
        onPeriodActivated: PropTypes.func.isRequired,
        onPeriodRemoved: PropTypes.func.isRequired,
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
        <div className={'d-grid mx-2'}>
            <hr className={'my-2'}/>
            <Row className={'d-flex align-items-center'}>
                <Col>
                    {props.periodObject.startDate} - {props.periodObject.endDate}
                </Col>
                <Col>
                    {/*{props.periodObject.availableMoney}*/}
                    spent money / {props.periodObject.availableMoney}
                </Col>
                <Col>
                    <div className={'d-flex justify-content-end'}>
                        <button
                            onClick={onPeriodActivatedButtonClicked}
                            className={'p-2 m-1'}
                            style={applyIconStyle}
                        >
                            <MdOpenInFull size={'1.0em'}/>
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
