import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateTaxPayerMutation } from "../../../../redux/api/taxPayerApi";
import StreetSelect from '../select/StreetSelect';
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import PropUseSelect from "../select/PropUseSelect";
import TaxpayerTypeSelect from "../select/TaxpayerTypeSelect";
import BankNoSelect from "../select/BankAccNoSelect";
import PropTypeSelect from "../select/PropTypeSelect";


interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const TaxPayerCreate: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createTaxPayer, { isLoading }] = useCreateTaxPayerMutation();

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    // holdingNo: Yup.string().required("হোল্ডিং নং প্রযোজ্য !"),

    WardNo: Yup.string()
      .required("ওয়ার্ড নাম্বার প্রযোজ্য!")
      .length(2, "ওয়ার্ড নাম্বার ঠিক 2 অঙ্ক হতে হবে!"), // only 2 characters

    sarkelNo: Yup.string()
      .required("সার্কেল নাম্বার প্রযোজ্য!")
      .length(3, "সার্কেল নাম্বার ঠিক 3 অঙ্ক হতে হবে!"),

    // sarkelNo: Yup.string()
    //   .required("সার্কেল নাম্বার প্রযোজ্য!")
    //   .length(3, "সার্কেল নাম্বার ঠিক 3 অঙ্ক হতে হবে!"), // only 3 characters

    HoldingNo: Yup.string()
      .required("হোল্ডিং নাম্বার প্রযোজ্য!")
      .min(4, "হোল্ডিং নাম্বার 4 অঙ্কের কম হতে পারবে না!"),
  });



  const formik = useFormik({
    initialValues: {
      WardNo: "",
      sarkelNo: "",
      HoldingNo: "",
      ClientNo: "",
      StreetID: "",
      OwnersName: "",
      FHusName: "",
      BillingAddress: "",
      PropTypeID: null,
      PropUseID: null,
      TaxpayerTypeID: null,
      OriginalValue: 0,
      CurrentValue: 0,
      Active: null,
      BankNo: null,
      HoldingTax: 0,
      WaterTax: 0,
      LightingTax: 0,
      ConservancyTax: 0,
      Arrear: 0,
      ArrStYear: 0,
      ArrStYear1: 0,
      ArrStPeriod: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await createTaxPayer(values).unwrap();
        Swal.fire("Success!", " created successfully!", "success");
        resetForm();
        handleClose();
      } catch (error: any) {
        console.log('asdfsadf', error?.data?.data);

        // যদি API থেকে validation error আসে
        if (error?.data?.data) {
          const apiErrors: Record<string, string> = {};

          Object.keys(error.data.data).forEach((field) => {
            // যদি array আসে, প্রথম error message নাও
            apiErrors[field] = Array.isArray(error.data.data[field])
              ? error.data.data[field][0]
              : error.data.data[field];
          });

          console.log(apiErrors);

          setErrors(apiErrors);
        } else {
          Swal.fire("Error!", "Something went wrong!", "error");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });




  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-bold text-white">
        <Modal.Title className="text-white">Tax Payer Create</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit} className="addform">
          <div className="border rounded p-3 pb-2 mb-4">
            <Row>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="WardNo">ওয়ার্ড নাম্বার</Form.Label>
                <Form.Control
                  type="text"
                  id="WardNo"
                  name="WardNo"
                  placeholder="ওয়ার্ড নাম্বার লিখুন"
                  value={formik.values.WardNo}
                  maxLength={2}
                  onChange={(e) => {
                    const ward = e.target.value.slice(0, 2);
                    formik.setFieldValue("WardNo", ward);

                    // Merge WardNo + sarkelNo + HoldingNo
                    const sarkel = formik.values.sarkelNo || "";
                    const holding = formik.values.HoldingNo || "";
                    formik.setFieldValue("ClientNo", `${ward}-${sarkel}-${holding}`);
                  }}
                  required
                />
                <div style={{ color: 'red', marginTop: "2px" }}>
                  {formik.errors.WardNo}
                </div>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="sarkelNo">সার্কেল নাম্বার</Form.Label>
                <Form.Control
                  type="text"
                  id="sarkelNo"
                  name="sarkelNo"
                  placeholder="সার্কেল নাম্বার লিখুন"
                  value={formik.values.sarkelNo}
                  maxLength={3}
                  onChange={(e) => {
                    const sarkel = e.target.value.slice(0, 3);
                    formik.setFieldValue("sarkelNo", sarkel);

                    const ward = formik.values.WardNo || "";
                    const holding = formik.values.HoldingNo || "";
                    formik.setFieldValue("ClientNo", `${ward}-${sarkel}-${holding}`);
                  }}
                  required
                />
                <div style={{ color: 'red', marginTop: "2px" }}>
                  {formik.errors.sarkelNo}
                </div>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="HoldingNo">হোল্ডিং নম্বর</Form.Label>
                <Form.Control
                  type="text"
                  id="HoldingNo"
                  name="HoldingNo"
                  placeholder="হোল্ডিং নম্বর লিখুন"
                  value={formik.values.HoldingNo}
                  onChange={(e) => {
                    const holding = e.target.value;
                    formik.setFieldValue("HoldingNo", holding);

                    const ward = formik.values.WardNo || "";
                    const sarkel = formik.values.sarkelNo || "";
                    formik.setFieldValue("ClientNo", `${ward}-${sarkel}-${holding}`);
                  }}
                  required
                />
                <div style={{ color: 'red', marginTop: "2px" }}>
                  {formik.errors.HoldingNo}
                </div>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="ClientNo">করদাতার আইডি</Form.Label>
                <Form.Control
                  type="text"
                  id="ClientNo"
                  name="ClientNo"
                  placeholder="ক্লায়েন্ট আইডি"
                  value={formik.values.ClientNo}
                  readOnly
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

                <div style={{ color: 'red', marginTop: "2px" }}>
                  {formik.errors.OwnersName}
                </div>

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

                <div style={{ color: 'red', marginTop: "2px" }}>
                  {formik.errors.FHusName}
                </div>

              </Col>




              <Col md={4} className="mb-3">
                <Form.Label htmlFor="StreetID">এলাকা / রাস্তার নাম</Form.Label>
                <StreetSelect
                  setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                />
                {formik.errors.StreetID && formik.touched.StreetID && (
                  <div className="text-danger">{formik.errors.StreetID}</div>
                )}
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

                />

                {formik.errors.BillingAddress && formik.touched.BillingAddress && (
                  <div className="text-danger">{formik.errors.BillingAddress}</div>
                )}
              </Col>
            </Row>
          </div>

          <Row>
            <Col md={6}>
              <div className="border rounded p-3 pb-2">
                <Row>



                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="PropUseID">হোল্ডিং ব্যবহার</Form.Label>
                    <PropUseSelect
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                    />
                    {formik.errors.PropUseID && formik.touched.PropUseID && (
                      <div className="text-danger">{formik.errors.PropUseID}</div>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="TaxpayerTypeID">করদাতার ধরন</Form.Label>
                    <TaxpayerTypeSelect
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                    />
                    {formik.errors.TaxpayerTypeID && formik.touched.TaxpayerTypeID && (
                      <div className="text-danger">{formik.errors.TaxpayerTypeID}</div>
                    )}
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="PropTypeID">হোল্ডিং এর ধরন</Form.Label>
                    <PropTypeSelect
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                    />
                    {formik.errors.PropTypeID && formik.touched.PropTypeID && (
                      <div className="text-danger">{formik.errors.PropTypeID}</div>
                    )}
                  </Col>


                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="BankNo">ব্যাংক নাম</Form.Label>
                    <BankNoSelect
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                    />
                    {formik.errors.BankNo && formik.touched.BankNo && (
                      <div className="text-danger">{formik.errors.BankNo}</div>
                    )}
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

                    />

                    {formik.errors.CurrentValue && formik.touched.CurrentValue && (
                      <div className="text-danger">{formik.errors.CurrentValue}</div>
                    )}
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

                    />

                    {formik.errors.Arrear && formik.touched.Arrear && (
                      <div className="text-danger">{formik.errors.Arrear}</div>
                    )}
                  </Col>


                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="dueYear">বকেয়ার বছর</Form.Label>
                    <Form.Control
                      type="number"
                      id="ArrStYear"
                      name="ArrStYear"  // Formik field name
                      placeholder="বকেয়ার বছর লিখুন"
                      value={`${formik.values.ArrStYear}`}
                      onChange={formik.handleChange}     // Formik handleChange

                    />

                    {formik.errors.ArrStYear && formik.touched.ArrStYear && (
                      <div className="text-danger">{formik.errors.ArrStYear}</div>
                    )}

                  </Col>


                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="dueYear1">বকেয়ার বছর ১</Form.Label>
                    <Form.Control
                      type="number"
                      id="ArrStYear1"
                      name="ArrStYear1"  // Formik field name
                      placeholder="বকেয়ার বছর লিখুন"
                      value={`${formik.values.ArrStYear1}`}
                      onChange={formik.handleChange}     // Formik handleChange
                    />
                    {formik.errors.ArrStYear1 && formik.touched.ArrStYear1 && (
                      <div className="text-danger">{formik.errors.ArrStYear1}</div>
                    )}

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
                    />
                    {formik.errors.ArrStPeriod && formik.touched.ArrStPeriod && (
                      <div className="text-danger">{formik.errors.ArrStPeriod}</div>
                    )}

                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className="border rounded mt-3 p-2">
            <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">

              {/* Holding Tax */}
              <Form.Check
                type="checkbox"
                id="HoldingTax"
                name="HoldingTax"
                label="হোল্ডিং ট্যাক্স"
                checked={formik.values.HoldingTax === 1}
                onChange={(e) =>
                  formik.setFieldValue("HoldingTax", e.target.checked ? 1 : 0)
                }
              />


              {/* Water Tax */}
              <Form.Check
                type="checkbox"
                id="WaterTax"
                name="WaterTax"
                label="পানি রেইট"
                checked={formik.values.WaterTax === 1}
                onChange={(e) =>
                  formik.setFieldValue("WaterTax", e.target.checked ? 1 : 0)
                }
              />

              <Form.Check
                type="checkbox"
                id="LightingTax"
                name="LightingTax"
                label="বিদ্যুৎ রেইট"
                checked={formik.values.LightingTax === 1}
                onChange={(e) =>
                  formik.setFieldValue("LightingTax", e.target.checked ? 1 : 0)
                }
              />

              {/* Conservancy Tax */}
              <Form.Check
                type="checkbox"
                id="ConservancyTax"
                name="ConservancyTax"
                label="সংরক্ষণ রেইট"
                checked={formik.values.ConservancyTax === 1}
                onChange={(e) =>
                  formik.setFieldValue("ConservancyTax", e.target.checked ? 1 : 0)
                }
              />

            </div>
          </div>





          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <div className="d-flex gap-2">

              <Button
                className="text-white"
                variant="primary"
                onClick={() => navigate("/taxPayer/search")}
              >
                Search
              </Button>
              <Button className="text-white" variant="warning">Edit</Button>

              <Button
                variant="success"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
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
    </Modal >
  );
};

export default TaxPayerCreate;
