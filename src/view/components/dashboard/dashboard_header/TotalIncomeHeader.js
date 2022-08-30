import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";
import Button from "react-bootstrap/Button";
import {editButtonStyle} from "../../../../res/customButtonsStyle";
import * as propTypes from "prop-types";

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
        <div className={'mx-2 mb-0 mt-3 text-mono'}>
            <Form className={'text-mono'} onSubmit={updateAvailableMoney}>
                <div className={'d-flex justify-content-center'}>
                    <h3 className={'d-inline'}>Income this month:</h3>
                    <CurrencyInput
                        style={{height: '20px', fontSize: '22pt'}}
                        className={''}
                        id={'incomeInput'}
                        disableGroupSeparators={true}
                        allowNegativeValue={false}
                        decimalScale={2}
                        placeholder={props.availableMoney}
                        onValueChange={value => setAvailableMoney(value)}
                    />
                    <div>
                        <Button
                            type={'submit'}
                            variant={'custom'}
                            size={'sm'}
                            className={'align-self-center mt-1'}
                            style={editButtonStyle}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default TotalIncomeHeader
