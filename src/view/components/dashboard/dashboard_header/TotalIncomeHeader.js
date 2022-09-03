import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";
import {applyIconStyle} from "../../../../res/customButtonsStyle";
import * as propTypes from "prop-types";
import {MdOutlineDone} from "react-icons/md";
import {Col, Row} from "react-bootstrap";

function TotalIncomeHeader(props) {
    TotalIncomeHeader.propTypes = {
        availableMoney: propTypes.string.isRequired,
        onAvailableMoneyChanged: propTypes.func.isRequired
    }

    const [availableMoney, setAvailableMoney] = useState(props.availableMoney)

    const updateAvailableMoney = (event) => {
        event.preventDefault()
        props.onAvailableMoneyChanged(availableMoney)
    }

    return (
        <div className={'my-2 text-mono d-flex justify-content-center'}>
            <Form className={'d-grid'} onSubmit={updateAvailableMoney}>
                <Row className={'mx-2'}>
                    <Col xs={'5'} md={'8'} className={'p-0'}>
                        <h3>Income this period:</h3>
                    </Col>
                    <Col xs={'4'} className={'p-0'}>
                        <div className={'d-flex'}>
                            <CurrencyInput
                                style={{width: '160px', height: '20px', fontSize: '22pt'}}
                                id={'incomeInput'}
                                disableGroupSeparators={true}
                                allowNegativeValue={false}
                                decimalScale={2}
                                placeholder={props.availableMoney}
                                onValueChange={value => setAvailableMoney(value)}
                            />
                            <button
                                type={'submit'}
                                onClick={updateAvailableMoney}
                                className={'px-2'}
                                style={applyIconStyle}
                            >
                                <MdOutlineDone size={'1.3em'}/>
                            </button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default TotalIncomeHeader
