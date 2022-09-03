import {toast} from "react-toastify";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import PreviousPeriodsContainer from "../components/archive/PreviousPeriodsContainer";
import {makeBackendRequest, sessionGetArchive, sessionSetActivePeriod, sessionSetArchive} from "../../backendUtil";

function ArchivePage(props) {
    const [archive, setArchive] = useState(sessionGetArchive())
    console.log('archive is ', archive)

    const onPeriodActivated = (activatedPeriod) => {
        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(activatedPeriod)
        makeBackendRequest('archive/activate_period', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    const newArchive = archive.filter(period => {
                        return period.startDate !== activatedPeriod.startDate
                    })
                    setArchive(newArchive)
                    sessionSetActivePeriod(activatedPeriod)
                    sessionSetArchive(newArchive)
                    toast.success('Period activated')
                }
                else {
                    res.json()
                        .then(data => toast.error(data['error_message']))
                        .catch(err => console.error(err))
                }
            })
            .catch(err => console.error(err))
    }

    const onPeriodRemoved = (removedPeriod) => {
        const headers = {'Content-Type': 'application/JSON'}
        const body = JSON.stringify(removedPeriod)
        makeBackendRequest('archive/remove_period', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    const newArchive = archive.filter(period => {
                        return period.startDate !== removedPeriod.startDate
                    })
                    setArchive(newArchive)
                    sessionSetArchive(newArchive)
                    toast.success('Period removed')
                }
            })
            .catch(err => console.error(err))
    }

    return (
        <>
            <div className={'d-flex justify-content-center align-items-center pt-3'}>
                <h1 className={'text-mono'}>Archive</h1>
            </div>
            <Container className={'content-container'}>
                <PreviousPeriodsContainer
                    previousPeriods={archive}
                    onPeriodActivated={onPeriodActivated}
                    onPeriodRemoved={onPeriodRemoved}
                />
            </Container>
        </>
    )
}

export default ArchivePage
