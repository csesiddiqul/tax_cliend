// import node module libraries
import { Row, Col, Card } from 'react-bootstrap';

const ActivityFeed = () => {
    return (
        <Row>
            <Col xs={12}>
                {/* card */}
                <Card>
                    {/* card body */}
                    <Card.Body>
                        {/* card title */}
                        <Card.Title as="h4">Active Account</Card.Title>

                        <div className="d-flex mb-5">
                        
                            <div className="ms-3 ">
                                <h5 className="mb-1">Dianna Smiley</h5>
                                <p className="text-muted mb-2">Just create a new Project in Dashui...
                                </p>
                               
                            </div>
                        </div>
                        <div className="d-flex mb-5">
                          
                            <div className="ms-3 ">
                                <h5 className="mb-1">Irene Hargrove</h5>
                                <p className="text-muted mb-2">Comment on Bootstrap Tutorial Says Hi, I m irene...
                                </p>
                               
                            </div>
                        </div>
                        <div className="d-flex">
                            
                            <div className="ms-3 ">
                                <h5 className="mb-1">Trevor Bradley</h5>
                                <p className="text-muted mb-2">Just share your article on Social Media..
                                </p>
                            
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ActivityFeed