// import node module libraries
import { Col, Row, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useGetTaxPayerInfoQuery } from "redux/api/rtkAuthApi";
import { useEffect, useState } from 'react';

const AboutMe = () => {
    const { data } = useGetTaxPayerInfoQuery();
    const [selectedId, setSelectedId] = useState("");
    const navigate = useNavigate();

    const user: any = data?.client;

    const handleClickTaxPayerReport = () => {
        if (selectedId) {
            navigate(`/user/single-bill-show/${selectedId}`);
        } else {
            alert("Please select a taxpayer ID first!");
        }
    };

    useEffect(() => {
        setSelectedId(user?.ClientNo);
    }, [user]);

    return (
        <Col xl={12} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>

                    {/* Title Left + Button Right */}
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="h4">About Me</Card.Title>

                        <Button
                            className="text-white"
                            variant="info"
                            onClick={handleClickTaxPayerReport}
                        >
                            Current Bill
                        </Button>
                    </div>

                    <Row>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Client No</h6>
                            <p className="mb-0">{user?.ClientNo}</p>
                        </Col>

                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Current Value</h6>
                            <p className="mb-0">{user?.CurrentValue}</p>
                        </Col>

                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Billing Address</h6>
                            <p className="mb-0">{user?.BillingAddress}</p>
                        </Col>

                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">FHus Name</h6>
                            <p className="mb-0">{user?.FHusName}</p>
                        </Col>

                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">HoldingNo</h6>
                            <p className="mb-0">{user?.HoldingNo}</p>
                        </Col>

                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">CurrentValue</h6>
                            <p className="mb-0">{user?.CurrentValue}</p>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutMe;
