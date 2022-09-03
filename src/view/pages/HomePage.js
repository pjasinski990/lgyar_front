import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, {useState} from 'react'
import {Container} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {getEmptyBudgetingPeriod} from '../../util'
import {defaultEnvelopes} from '../../res/defaultEnvelopes'
import Dashboard from '../components/dashboard/Dashboard'
import {sessionGetActivePeriod, makeBackendRequest, sessionGetArchive, sessionSetArchive} from '../../backendUtil'

function HomePage(props) {
    const [activePeriod, setActivePeriod] = useState(sessionGetActivePeriod())

    function createNewActivePeriod(event) {
        const newPeriod = getEmptyBudgetingPeriod()
        const headers = {'Content-Type': 'application/JSON'}
        if (props.user.previousPeriods && props.user.previousPeriods.length > 0) {
            const lastPeriod = props.user.previousPeriods.slice(-1)[0]
            const lastEnvelopes = lastPeriod.envelopes
            newPeriod.envelopes = lastEnvelopes.map((e) => {
                e.spent = '0'
                return e
            })
            newPeriod.availableMoney = lastPeriod.availableMoney
        }
        else {
            newPeriod.envelopes = defaultEnvelopes
        }
        const body = JSON.stringify(newPeriod)
        makeBackendRequest('ap/create', 'post', body, headers)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(created => {
                            setActivePeriod(created)
                            sessionStorage.setItem('active_period', JSON.stringify(created))
                        })
                        .catch(err => console.err(err))
                }
                else {
                    res.json()
                        .then(data => toast.error(data['error_message']))
                        .catch(err => console.error(err))
                }
            })
    }

    function finishCurrentActivePeriod(event) {
        makeBackendRequest('ap/archive', 'post', null, null)
            .then(res => {
                if (res.ok) {
                    const archive = sessionGetArchive() ? sessionGetArchive() : []
                    const activePeriodUpdated = sessionGetActivePeriod()
                    archive.push(activePeriodUpdated)
                    sessionSetArchive(archive)

                    setActivePeriod(null)
                    sessionStorage.setItem('active_period', null)
                    toast.success('Period archived')
                }
                else {
                    res.json()
                        .then(data => toast.error(data['error_message']))
                        .catch(err => console.error(err))
                }
            })
    }

    return (
        <>
            <Container className={'d-grid'}>
                {!activePeriod &&
                <Container className={'content-container'}>
                    <h3>
                        There is no active budgeting period
                    </h3>
                    <p>
                        Activate a budgeting period from the archive or create a new period using the button below
                    </p>
                </Container>
                }
                {activePeriod &&
                <Dashboard user={props.user}/>
                }
                <Row className={'px-1 mt-3'}>
                    {!activePeriod &&
                    <Col className={'px-0'}>
                        <div className={'m-2 d-grid px-0'}>
                            <Button onClick={createNewActivePeriod} block={'true'} variant={'secondary'}>Create new period</Button>
                        </div>
                    </Col>
                    }
                    {activePeriod &&
                    <Col className={'px-0'}>
                        <div className={'m-2 d-grid px-0'}>
                            <Button onClick={finishCurrentActivePeriod} block={'true'}>Finish current period</Button>
                        </div>
                    </Col>
                    }
                </Row>
            </Container>
        </>
    )
}

export default HomePage
