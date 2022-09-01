import React, {forwardRef, useState} from "react";
import {useMediaPredicate} from 'react-media-hook'
import DatePicker from 'react-datepicker'
import * as propTypes from "prop-types";
import dateFormat from "dateformat";
import {makeBackendRequest} from "../../../../util";
import {BiCalendarEdit} from "react-icons/bi";

function PeriodRangePicker(props) {
    PeriodRangePicker.propTypes = {
        onStartDateChanged: propTypes.func.isRequired,
        onEndDateChanged: propTypes.func.isRequired
    }
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(null)

    const onChange = (dates) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)

        if (!!end) {
            props.onStartDateChanged(dateFormat(start, 'yyyy-mm-dd'))
            props.onEndDateChanged(dateFormat(end, 'yyyy-mm-dd'))
        }
    }
    return (
        <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            customInput={<EditRangeButton/>}
        />
    )
}

const EditRangeButton = forwardRef(({value, onClick}, ref) =>(
    <btn onClick={onClick} ref={ref}><BiCalendarEdit cursor={'pointer'} size={'2.0em'}/></btn>
))


function ActivePeriodRange(props) {
    ActivePeriodRange.propTypes = {
        activePeriodRange: propTypes.object.isRequired,
        onPeriodRangeChanged: propTypes.func.isRequired
    }

    const [startDate, setStartDate] = useState(props.activePeriodRange.startDate)
    const [endDate, setEndDate] = useState(props.activePeriodRange.endDate)
    const biggerThan768px = useMediaPredicate('(min-width: 768px)')

    const onStartDateChanged = (newDate) => {
        const body = JSON.stringify(newDate)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_start_date', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    setStartDate(newDate)
                }
            })
    }

    const onEndDateChanged = (newDate) => {
        const body = JSON.stringify(newDate)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_end_date', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    setEndDate(newDate)
                }
            })
    }

    return (
        <div className={'d-flex justify-content-center align-items-center pt-3'}>
            {biggerThan768px && <h1 className={'text-mono'}>{startDate} - {endDate}</h1>}
            {!biggerThan768px && <h2 className={'text-mono'}>{startDate} - {endDate}</h2>}
            <div className={'mx-2 mb-2'}>
                <PeriodRangePicker
                    onStartDateChanged={onStartDateChanged}
                    onEndDateChanged={onEndDateChanged}
                />
            </div>
        </div>
    )
}

export default ActivePeriodRange
