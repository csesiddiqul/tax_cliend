import React, {useMemo } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const validationSchema = Yup.object({
    holdingNo: Yup.string().required("হোল্ডিং নং প্রযোজ্য !"),
    ownerName: Yup.string().required("করদাতার নাম প্রযোজ্য !"),
  });

  const formik = useFormik({
    initialValues: {
      holdingNo: "",
      holdingId: "",
      ownerName: "",
      fatherName: "",
      area: "",
      address: "",
      useType: "",
      baseValue: "",
      holdingType: "",
      rent: "",
      year: "",
      bankName: "",
      branch: "",
      taxType: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data", values);
      handleClose();
    },
  });

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-bold text-white">
        <Modal.Title className="text-white">Tax Payer's Information</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit} className="addform">
          <div className="border rounded p-3 pb-2 mb-4">
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

          <Row>
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

<div className="border rounded mt-3 p-2">
  <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
    {[
      { value: "holding", label: "হোল্ডিং ট্যাক্স" },
      { value: "collection", label: "সংরক্ষণ রেইট" },
      { value: "electric", label: "বিদ্যুৎ রেইট" },
      { value: "water", label: "পানি রেইট" },
    ].map((tax) => (
      <Form.Check
        key={tax.value}
        inline
        type="radio"
        name="taxType"
        value={tax.value}
        label={tax.label}
        onChange={formik.handleChange}
        className="cursor-pointer"
      />
    ))}
  </div>
</div>




          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <div className="d-flex gap-2">
              <Button className="text-white" variant="primary">Add</Button>
              <Button className="text-white" variant="warning">Edit</Button>
              <Button variant="success" type="submit">
                Save
              </Button>
            </div>
            <div className="d-flex gap-2">
              <Button className="text-white" variant="info">Single Bill</Button>
              <Button variant="primary">View</Button>
              <Button variant="secondary">Report</Button>
              <Button variant="danger" onClick={handleClose}>
                Exit
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Create;