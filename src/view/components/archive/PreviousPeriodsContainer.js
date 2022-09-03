import React from 'react'
import * as PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import PreviousPeriodEntry from "./PreviousPeriodEntry";

function PreviousPeriodsContainer(props) {
    PreviousPeriodsContainer.propTypes = {
        previousPeriods: PropTypes.array.isRequired,
        onPeriodActivated: PropTypes.func.isRequired,
        onPeriodRemoved: PropTypes.func.isRequired,
    }

    const previousPeriods = props.previousPeriods
    if (previousPeriods === null || previousPeriods.length === 0) {
        return (
            <h5 className={'m-3'}>
                No entries
            </h5>
        )
    }
    else {
        let res = previousPeriods.map(period => {
            return <PreviousPeriodEntry
                key={period.startDate}
                periodObject={period}
                onPeriodActivated={props.onPeriodActivated}
                onPeriodRemoved={props.onPeriodRemoved}
            />
        })
        return (
            <>
                <div className={'d-grid mx-3'}>
                    <Row>
                        <Col>
                            <b>Time range</b>
                        </Col>
                        <Col>
                            <b>Available money</b>
                        </Col>
                        <Col className={'d-flex justify-content-end'}>
                            <b>Action</b>
                        </Col>
                    </Row>
                </div>
                <Stack direction={'vertical'}>
                    {res}
                </Stack>
            </>
        )
    }
}

export default PreviousPeriodsContainer
