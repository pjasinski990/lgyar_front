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
                <div className={'d-grid mx-2'}>
                    <Row>
                        <Col xs={4}>
                            <b className={'px-1'}>Period</b>
                        </Col>
                        <Col xs={3} className={'d-flex justify-content-end'}>
                            <b>Spent / Available</b>
                        </Col>
                        <Col xs={2} className={'d-flex justify-content-end'}>
                            <b>Transactions</b>
                        </Col>
                        <Col xs={3} className={'d-flex justify-content-end'}>
                            <b className={'px-1'}>Action</b>
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
