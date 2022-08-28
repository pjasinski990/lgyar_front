import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class Footer extends React.Component {
    state = {email: '*click to reveal email*'}
    onRevealEmail = () => {this.setState({email: 'piotr.jasinski990@gmail.com'})}

    render() {
        return (
            <>
                <hr/>
                <footer>
                    <Row className={'m-0'}>
                        <Col sm={3} xs={1}/>
                        <Col sm={4} xs={5} className={'mb-2'}>
                            <small>
                                Copyright &copy; {new Date().getFullYear()} Piotr Jasiński
                            </small>
                        </Col>
                        <Col xs={5}>
                            <small className={'d-block pb-0'}>
                                Contact:
                            </small>
                            <small className={'d-block'}>
                                https://github.com/pjasinski990
                            </small>
                            <small className={'d-block'} onClick={this.onRevealEmail}>
                                <div style={{cursor: `${this.state.email.startsWith('*') ? 'pointer' : ''}`}}>
                                    {this.state.email}
                                </div>
                            </small>
                        </Col>
                    </Row>
                </footer>
                <hr/>
            </>
        )
    }
}

export default Footer
