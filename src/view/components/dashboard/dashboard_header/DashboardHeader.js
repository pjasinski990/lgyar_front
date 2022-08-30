import React from "react";
import ActivePeriodRange from "./ActivePeriodRange";
import TotalIncomeHeader from "./TotalIncomeHeader";
import * as propTypes from "prop-types";

function DashboardHeader(props) {
    DashboardHeader.propTypes = {
        activePeriodRange: propTypes.object.isRequired,
        onPeriodRangeChanged: propTypes.func.isRequired,
        availableMoney: propTypes.string.isRequired,
        onAvailableMoneyChanged: propTypes.func.isRequired
    }

    return (
        <div>
            <ActivePeriodRange
                activePeriodRange={{startDate: props.activePeriodRange.startDate, endDate: props.activePeriodRange.endDate}}
                onPeriodRangeChanged={props.onPeriodRangeChanged}
            />
            <TotalIncomeHeader
                availableMoney={props.availableMoney}
                onAvailableMoneyChanged={props.onAvailableMoneyChanged}
            />
        </div>
    )
}

export default DashboardHeader
