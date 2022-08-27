import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {makeBackendRequest} from "../../util";
import {defaultEnvelopes} from "../../res/defaultEnvelopes";
import Dashboard from "../components/dashboard/Dashboard";

function HomeNonLogged(props) {
    return (
        <>
            <Container className={'content-container'}>
                <h1>Welcome!</h1>
                <h5>Please <Link to={'../login'}>log in</Link> to get started.</h5>
            </Container>
        </>
    )
}

function HomeLogged(props) {
    function createNewActivePeriod(event) {
        const activePeriod = props.user.activePeriod
        if (activePeriod) {
            toast.error('Finish current period first')
        }
        else {
            const headers = {'Content-Type': 'application/JSON'}
            let body
            if (props.user.previousPeriods && props.user.previousPeriods.length > 0) {
                const previousPeriods = props.user.previousPeriods
                const lastEnvelopes = previousPeriods[previousPeriods.length - 1].envelopes
                const lastEnvelopesCleaned = lastEnvelopes.map((e) => { e.limit = 0; e.spent = 0; return e })
                body = JSON.stringify(lastEnvelopesCleaned)
            }
            else {
                body = JSON.stringify(defaultEnvelopes)
            }
            makeBackendRequest('ap/create', 'post', body, headers)
                .then(res => {
                    window.location.reload(false)
                })
        }
    }

    function finishCurrentActivePeriod(event) {
        if (!props.user.activePeriod) {
            toast.error('There is no budgeting period activated')
        }
        else {
            makeBackendRequest('ap/archive', 'post', null, null)
                .then(res => {
                    window.location.reload(false)
                })
        }
    }

    const activePeriod = props.user.activePeriod
    let tooltip = ''
    if (!activePeriod) {
        tooltip = 'NO ACTIVE PERIOD'
    }
    else {
        tooltip = activePeriod.startDate + '  -  ' + activePeriod.endDate
    }

    return (
        <>
            <h1 className={'pt-3 text-mono'} style={{display: 'flex', justifyContent: 'center'}}>{tooltip}</h1>
            <Container className={'d-grid'}>
                {!props.user.activePeriod &&
                    <Container className={'content-container'}>
                        <h3>
                            There is no active budgeting period
                        </h3>
                        <p>
                            Activate a budgeting period from the archive or create a new period using the button below
                        </p>
                    </Container>
                }
                {props.user.activePeriod &&
                    <Dashboard user={props.user}/>
                }
                <Row className={'px-1 mt-3'}>
                    {!props.user.activePeriod &&
                        <Col className={'px-0'}>
                            <div className={'m-2 d-grid px-0'}>
                                <Button onClick={createNewActivePeriod} block={'true'} variant={'secondary'}>Create new period</Button>
                            </div>
                        </Col>
                    }
                    {props.user.activePeriod &&
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

function HomePage(props) {
    if (props.user.logged) {
        return HomeLogged(props)
    }
    else {
        return HomeNonLogged(props)
    }
}

export default HomePage
