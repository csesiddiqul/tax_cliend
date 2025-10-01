// import node module libraries
import { Col, Row, Form, Card, Button } from "react-bootstrap";
// import hooks
import { useMounted } from "hooks/useMounted";

const Addinfo = () => {
  const hasMounted = useMounted();

  return (
    <Row className="mb-8 addform">
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card className="p-2 shadow-sm">
          <Card.Body>
            {hasMounted && (
              <Form>
                {/* Section 1: উপরের ৬টা ফিল্ড */}
                <div className="border rounded p-3 pb-2 mb-7">
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="holdingNumber">হোল্ডিং নম্বর</Form.Label>
                      <Form.Select id="holdingNumber" required>
                        <option value="">হোল্ডিং নম্বর</option>
                        <option value="101">101</option>
                        <option value="102">102</option>
                        <option value="103">103</option>
                      </Form.Select>
                    </Col>

                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="korDatarId">করদাতার আইডি</Form.Label>
                      <Form.Select id="korDatarId" required>
                        <option value="">করদাতার আইডি</option>
                        <option value="KD001">KD001</option>
                        <option value="KD002">KD002</option>
                        <option value="KD003">KD003</option>
                      </Form.Select>
                    </Col>


                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="korDatarName">করদাতার নাম</Form.Label>
                      <Form.Control
                        type="text"
                        id="korDatarName"
                        placeholder="করদাতার নাম লিখুন"
                        required
                      />
                    </Col>

                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="fatherName">পিতা / স্বামীর নাম</Form.Label>
                      <Form.Control
                        type="text"
                        id="fatherName"
                        placeholder="পিতা / স্বামীর নাম লিখুন"
                        required
                      />
                    </Col>

                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="areaName">এলাকা / রাস্তার নাম</Form.Label>
                      <Form.Select id="areaName" required>
                        <option value="">এলাকা / রাস্তার নাম</option>
                        <option value="road1">রাস্তা ১</option>
                        <option value="road2">রাস্তা ২</option>
                        <option value="road3">রাস্তা ৩</option>
                      </Form.Select>
                    </Col>

                    <Col md={4} className="mb-3">
                      <Form.Label htmlFor="holdingAddress">মোবাইল নম্বর</Form.Label>
                      <Form.Control
                        type="text"
                        id="holdingAddress"
                        placeholder="মোবাইল নম্বর লিখুন"
                        required
                      />
                    </Col>
                  </Row>
                </div>

                {/* Section 2: নিচের ৮টা ফিল্ড ভাগ করে */}
                <Row>
                  {/* Left side: ৪টা ফিল্ড */}
                  <Col md={6}>
                    <div className="border rounded p-3 pb-2">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="holdingUse">হোল্ডিং ব্যবহার</Form.Label>
                          <Form.Select id="holdingUse" required>
                            <option value="">হোল্ডিং ব্যবহার</option>
                            <option value="residential">বসতবাড়ি</option>
                            <option value="commercial">ব্যবসা</option>
                            <option value="mixed">মিশ্র</option>
                          </Form.Select>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="korDatarType">করদাতার ধরন</Form.Label>
                          <Form.Select id="korDatarType" required>
                            <option value="">করদাতার ধরন</option>
                            <option value="person">ব্যক্তি</option>
                            <option value="organization">প্রতিষ্ঠান</option>
                          </Form.Select>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="holdingType">হোল্ডিং এর ধরন</Form.Label>
                          <Form.Select id="holdingType" required>
                            <option value="">হোল্ডিং এর ধরন</option>
                            <option value="permanent">স্থায়ী</option>
                            <option value="temporary">অস্থায়ী</option>
                          </Form.Select>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="bankName">ব্যাংক নাম</Form.Label>
                          <Form.Select id="bankName" required>
                            <option value="">ব্যাংক নাম</option>
                            <option value="sonali">সোনালী ব্যাংক</option>
                            <option value="rupali">রূপালী ব্যাংক</option>
                            <option value="janata">জনতা ব্যাংক</option>
                            <option value="agrani">অগ্রণী ব্যাংক</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </div>
                  </Col>


                  {/* Right side: ৪টা ফিল্ড */}
                  <Col md={6}>
                    <div className="border rounded p-3 pb-2">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="annualValue">বার্ষিক মূল্যমান</Form.Label>
                          <Form.Control
                            type="text"
                            id="annualValue"
                            placeholder="বার্ষিক মূল্যমান লিখুন"
                            required
                          />
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="dueAmount">বকেয়ার টাকা</Form.Label>
                          <Form.Control
                            type="text"
                            id="dueAmount"
                            placeholder="বকেয়ার টাকা লিখুন"
                            required
                          />
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="dueYear">বকেয়ার বছর</Form.Label>
                          <Form.Control
                            type="text"
                            id="dueYear"
                            placeholder="বকেয়ার বছর লিখুন"
                            required
                          />
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Label htmlFor="dueInstallment">বকেয়ার কিস্তি</Form.Label>
                          <Form.Control
                            type="text"
                            id="dueInstallment"
                            placeholder="বকেয়ার কিস্তি লিখুন"
                            required
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                {/* Submit button */}
                <Row>
                  <Col md={12}>
                    <Button type="submit" variant="primary" className="mt-7">
                      তথ্য সংরক্ষণ করুন
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Addinfo;
