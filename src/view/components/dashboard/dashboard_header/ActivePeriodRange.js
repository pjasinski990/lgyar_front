import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import * as propTypes from "prop-types";

function ActivePeriodRange(props) {
    ActivePeriodRange.propTypes = {
        activePeriodRange: propTypes.object.isRequired,
        onPeriodRangeChanged: propTypes.func.isRequired
    }

    const [tooltip, setTooltip] = useState(props.activePeriodRange.startDate + '  -  ' + props.activePeriodRange.endDate)

    const displayCalendar = () => {
        console.log('display calendar now')
        setTooltip('')
    }

    return (
        <div className={'d-flex justify-content-center align-items-start'}>
            <h1 className={'pt-3 text-mono'}>{tooltip}</h1>
            <Button className={'mt-3 p-1'} onClick={displayCalendar}>edit</Button>
        </div>
    )
}

export default ActivePeriodRange
