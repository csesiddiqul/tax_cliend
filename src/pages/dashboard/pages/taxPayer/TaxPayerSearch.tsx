import React, { useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLazyGetTaxPayerClientByIdQuery } from "../../../../redux/api/taxPayerApi";
import TaxPayerSelect from '../select/TaxPayerSelect';
import { useNavigate } from "react-router";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const TaxPayerCreate: React.FC<CreateProps> = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    // holdingNo: Yup.string().required("হোল্ডিং নং প্রযোজ্য !"),
    // ownerName: Yup.string().required("করদাতার নাম প্রযোজ্য !"),
  });

  const [getTaxPayerById, { data }] = useLazyGetTaxPayerClientByIdQuery();

  console.log('mydata', data);

  console.log('asdfasdf', data?.data?.ClientNo);


  const formik = useFormik({
    initialValues: {
      HoldingNo: "",
      ClientNo: "",
      StreetID: "",
      OwnersName: "",
      FHusName: "",
      BillingAddress: "",
      PropTypeID: 0,
      PropUseID: 0,
      TaxpayerTypeID: 0,
      OriginalValue: 0,
      CurrentValue: 0,
      Active: false,
      BankNo: 0,
      HoldingTax: 0,
      WaterTax: 0,
      LightingTax: 0,
      ConservancyTax: 0,
      Arrear: 0,
      ArrStYear: 0,
      ArrStYear1: 0,
      ArrStPeriod: 0,
      data: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data", values);
      handleClose();
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched Data:", data);
      formik.setValues({
        ...formik.values,
        ClientNo: data?.data?.ClientNo || "",
        HoldingNo: data?.data?.HoldingNo || "",
        OwnersName: data?.data?.OwnersName || "",
        FHusName: data?.data?.FHusName || "",
        StreetID: data?.data?.street || "",
        BillingAddress: data?.data?.BillingAddress || "",
        PropTypeID: data?.data?.PropTypeID || 0,
        PropUseID: data?.data?.PropUseID || 0,
        TaxpayerTypeID: data?.data?.TaxpayerTypeID || 0,
        OriginalValue: data?.data?.OriginalValue || 0,
        CurrentValue: data?.data?.CurrentValue || 0,
        Active: data?.data?.Active || '',
        BankNo: data?.data?.BankNo || 0,
        HoldingTax: data?.data?.HoldingTax || 0,
        WaterTax: data?.data?.WaterTax || 0,
        LightingTax: data?.data?.LightingTax || 0,
        ConservancyTax: data?.data?.ConservancyTax || 0,
        Arrear: data?.data?.Arrear || 0,
        ArrStYear: data?.data?.ArrStYear || 0,
        ArrStYear1: data?.data?.ArrStYear1 || 0,
        ArrStPeriod: data?.data?.ArrStPeriod || 0,
      });
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-bold text-white">
        <Modal.Title className="text-white">Tax Payer's Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit} className="addform">
          <div className="border rounded p-3 pb-2 mb-4">
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label htmlFor="ClientNo">করদাতার আইডি</Form.Label>

                <TaxPayerSelect
                  setFieldValue={(field, value) => {
                    formik.setFieldValue(field, value);
                    if (value) getTaxPayerById(value);
                  }}
                />

              </Col>


              <Col md={4} className="mb-3">
                <Form.Label htmlFor="HoldingNo">হোল্ডিং নম্বর </Form.Label>
                <Form.Control
                  type="text"
                  id="HoldingNo"
                  name="HoldingNo"  // Formik field name
                  placeholder="হোল্ডিং নম্বর"
                  value={formik.values.HoldingNo}   // Formik value bind
                  onChange={formik.handleChange}     // Formik handleChange
                  required
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="OwnersName">করদাতার নাম</Form.Label>
                <Form.Control
                  type="text"
                  id="OwnersName"
                  name="OwnersName"  // Formik field name
                  placeholder="করদাতার নাম লিখুন"
                  value={formik.values.OwnersName}   // Formik value bind
                  onChange={formik.handleChange}     // Formik handleChange
                  required
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="fHusName">বাবা / স্বামীর নাম</Form.Label>
                <Form.Control
                  type="text"
                  id="fHusName"
                  name="FHusName"  // Formik field name
                  placeholder="বাবা / স্বামীর নাম লিখুন"
                  value={formik.values.FHusName}   // Formik value bind
                  onChange={formik.handleChange}     // Formik handleChange
                  required
                />
              </Col>




              <Col md={4} className="mb-3">
                <Form.Label htmlFor="StreetID">এলাকা / রাস্তার নাম</Form.Label>
                <Form.Select
                  id="StreetID"
                  name="StreetID"
                  value={formik.values.StreetID || ""}
                  onChange={formik.handleChange}
                  required
                >
                  {data?.data?.street && (
                    <option value={data.data.street.StreetID}>
                      {data.data.street.StreetName}
                    </option>
                  )}
                </Form.Select>
              </Col>


              <Col md={4} className="mb-3">
                <Form.Label htmlFor="billingAddress">মোবাইল নম্বর</Form.Label>
                <Form.Control
                  type="text"
                  id="billingAddress"
                  name="BillingAddress"  // Formik field name
                  placeholder="মোবাইল নম্বর লিখুন"
                  value={formik.values.BillingAddress}   // Formik value bind
                  onChange={formik.handleChange}     // Formik handleChange
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
                    <Form.Label htmlFor="PropUseID">হোল্ডিং ব্যবহার</Form.Label>
                    <Form.Select
                      id="PropUseID"
                      name="PropUseID"
                      value={formik.values.PropUseID || ""}
                      onChange={formik.handleChange}
                      required
                    >
                      {data?.data?.prop_use_i_d && (
                        <option value={data?.data?.prop_use_i_d.PropUseID}>
                          {data?.data?.prop_use_i_d?.PropertyUse}
                        </option>
                      )}
                      {/* <option value="">হোল্ডিং ব্যবহার</option> */}



                    </Form.Select>
                  </Col>



                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="TaxpayerTypeID">করদাতার ধরন</Form.Label>
                    <Form.Select
                      id="TaxpayerTypeID"
                      name="TaxpayerTypeID"
                      value={formik.values.TaxpayerTypeID || ""}
                      onChange={formik.handleChange}
                      required
                    >

                      {data?.data?.taxpayer_type && (
                        <option value={data?.data?.taxpayer_type.TaxpayerTypeID}>
                          {data?.data?.taxpayer_type?.TaxpayerType}
                        </option>
                      )}
                      {/* <option value="">করদাতার ধরন</option> */}
                    </Form.Select>
                  </Col>



                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="BankNo">হোল্ডিং এর ধরন</Form.Label>
                    <Form.Select
                      id="BankNo"
                      name="BankNo"
                      value={formik.values.PropTypeID || ""}
                      onChange={formik.handleChange}
                      required
                    >
                      {data?.data?.tbl_prop_type && (
                        <option value={data?.data?.tbl_prop_type.PropTypeID}>
                          {data?.data?.tbl_prop_type?.PropertyType}
                        </option>
                      )}


                      {/* <option value="">হোল্ডিং এর ধরন</option> */}

                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="BankNo">ব্যাংক নাম</Form.Label>
                    <Form.Select
                      id="BankNo"
                      name="BankNo"
                      value={formik.values.BankNo || ""}
                      onChange={formik.handleChange}
                      required
                    >
                      <option value="">ব্যাংক নাম</option>

                      {data?.data?.bank_acc && (
                        <option value={data?.data?.bank_acc.BankNo}>
                          {data?.data?.bank_acc?.BankName}
                        </option>
                      )}
                    </Form.Select>
                  </Col>




                </Row>
              </div>
            </Col>

            <Col md={6}>
              <div className="border rounded p-3 pb-2">
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="CurrentValue">বার্ষিক মূল্যমান</Form.Label>
                    <Form.Control
                      type="text"
                      id="CurrentValue"
                      name="CurrentValue"  // Formik field name
                      placeholder="বার্ষিক মূল্যমান"
                      value={formik.values.CurrentValue}   // Formik value bind
                      onChange={formik.handleChange}     // Formik handleChange
                      required
                    />
                  </Col>




                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="dueAmount">বকেয়ার টাকা</Form.Label>
                    <Form.Control
                      type="text"
                      id="Arrear"
                      name="Arrear"  // Formik field name
                      placeholder="বকেয়ার টাকা লিখুন"
                      value={formik.values.Arrear}   // Formik value bind
                      onChange={formik.handleChange}     // Formik handleChange
                      required
                    />
                  </Col>


                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="dueYear">বকেয়ার বছর</Form.Label>
                    <Form.Control
                      type="text"
                      id="ArrStYear"
                      name="ArrStYear"  // Formik field name
                      placeholder="বকেয়ার বছর লিখুন"
                      value={`${formik.values.ArrStYear}-${formik.values.ArrStYear1}`}
                      onChange={formik.handleChange}     // Formik handleChange
                      required

                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="dueInstallment">বকেয়ার কিস্তি</Form.Label>
                    <Form.Control
                      type="text"
                      id="ArrStPeriod"
                      name="ArrStPeriod"  // Formik field name
                      placeholder="বকেয়ার কিস্তি লিখুন"
                      value={formik.values.ArrStPeriod}   // Formik value bind
                      onChange={formik.handleChange}     // Formik handleChange
                      required
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className="border rounded mt-3 p-2">
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">

              {/* Holding Tax */}
              <Form.Check
                inline
                type="checkbox"
                name="HoldingTax"
                label="হোল্ডিং ট্যাক্স"
                checked={formik.values.HoldingTax == 1}
                onChange={(e) =>
                  formik.setFieldValue("HoldingTax", e.target.checked ? 1 : 0)
                }
                className="cursor-pointer"
              />

              {/* Conservancy Tax */}
              <Form.Check
                inline
                type="checkbox"
                name="ConservancyTax"
                label="সংরক্ষণ রেইট"
                checked={formik.values.ConservancyTax == 1}
                onChange={(e) =>
                  formik.setFieldValue("ConservancyTax", e.target.checked ? 1 : 0)
                }
                className="cursor-pointer"
              />

              {/* Lighting Tax */}
              <Form.Check
                inline
                type="checkbox"
                name="LightingTax"
                label="বিদ্যুৎ রেইট"
                checked={formik.values.LightingTax == 1}
                onChange={(e) =>
                  formik.setFieldValue("LightingTax", e.target.checked ? 1 : 0)
                }
                className="cursor-pointer"
              />

              {/* Water Tax */}
              <Form.Check
                inline
                type="checkbox"
                name="WaterTax"
                label="পানি রেইট"
                checked={formik.values.WaterTax == 1}
                onChange={(e) =>
                  formik.setFieldValue("WaterTax", e.target.checked ? 1 : 0)
                }
                className="cursor-pointer"
              />

            </div>
          </div>





          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <div className="d-flex gap-2">
              <Button
                className="text-white"
                variant="primary"
                onClick={() => navigate("/taxPayer/create")}
              >
                Add
              </Button>
              <Button className="text-white" variant="warning">Edit</Button>


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
    </Modal >
  );
};

export default TaxPayerCreate;
