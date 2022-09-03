import React, {forwardRef, useState} from "react";
import {toast} from "react-toastify";
import {useMediaPredicate} from 'react-media-hook'
import DatePicker from 'react-datepicker'
import dateFormat from "dateformat";
import {
    makeBackendRequest,
    sessionGetActivePeriod,
    sessionSetEndDate,
    sessionSetStartDate
} from "../../../../backendUtil";
import {BiCalendarEdit} from "react-icons/bi";

function PeriodRangePicker(props) {
    const [startDate, setStartDate] = useState(null)
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
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            customInput={<EditRangeButton/>}
        />
    )
}

const EditRangeButton = forwardRef(({value, onClick}, ref) =>(
    <button onClick={onClick} ref={ref}><BiCalendarEdit cursor={'pointer'} size={'2.0em'}/></button>
))


function ActivePeriodRange(props) {
    const [startDate, setStartDate] = useState(sessionGetActivePeriod().startDate)
    const [endDate, setEndDate] = useState(sessionGetActivePeriod().endDate)
    const biggerThan768px = useMediaPredicate('(min-width: 768px)')

    const onStartDateChanged = (newDate) => {
        const body = JSON.stringify(newDate)
        const headers = {'Content-Type': 'application/JSON'}
        makeBackendRequest('ap/edit_start_date', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    setStartDate(newDate)
                    sessionSetStartDate(newDate)
                }
                else {
                    res.json()
                        .then(data => toast.error(data['error_message']))
                        .catch(err => console.error(err))
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
                    sessionSetEndDate(newDate)
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
