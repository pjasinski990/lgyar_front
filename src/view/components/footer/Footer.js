import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class Footer extends React.Component {
    state = {email: '* click to reveal email *'}
    onRevealEmail = () => {this.setState({email: 'piotr.jasinski990@gmail.com'})}

    render() {
        return (
            <>
                <hr/>
                <footer>
                    <Row className={'m-0'}>
                        <Col xs={3}/>
                        <Col xs={4}>
                            <small>
                                Copyright &copy; {new Date().getFullYear()} Piotr Jasiński
                            </small>
                        </Col>
                        <Col xs={4}>
                            <small className={'d-block pb-1'}>
                                Contact:
                            </small>
                            <small className={'d-block'}>
                                https://github.com/pjasinski990
                            </small>
                            <small className={'d-block'} onClick={this.onRevealEmail}>
                                <div style={{cursor: 'pointer'}}>
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
