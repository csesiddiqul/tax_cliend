import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useLazyGetTaxPayerClientByIdQuery,
  useUpdateTaxPayerMutation,
} from "../../../../redux/api/taxPayerApi";
import TaxPayerSelect from "../select/TaxPayerSelect";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import StreetSelect from "../select/StreetSelect";
import PropUseSelect from "../select/PropUseSelect";
import TaxpayerTypeSelect from "../select/TaxpayerTypeSelect";
import PropTypeSelect from "../select/PropTypeSelect";
import BankAccSelect from "../select/BankAccSelect";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const TaxPayerSearch: React.FC<CreateProps> = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state

  const validationSchema = Yup.object({
    // HoldingNo: Yup.string().required("হোল্ডিং নং প্রযোজ্য !"),
    // OwnersName: Yup.string().required("করদাতার নাম প্রযোজ্য !"),
  });

  const [getTaxPayerById, { data }] = useLazyGetTaxPayerClientByIdQuery();
  const [updateTaxPayer] = useUpdateTaxPayerMutation();

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
      ArrStPeriod: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (data?.data?.ClientNo) {
          // UPDATE Mode
          const formData = new FormData();
          formData.append("_method", "put");
          Object.keys(values).forEach((key) => {
            formData.append(key, (values as any)[key]);
          });

          const res: any = await updateTaxPayer({
            id: data?.data?.ClientNo,
            data: formData,
          }).unwrap();

          if (res?.success) {
            Swal.fire("Updated!", "Tax Payer updated successfully.", "success");
            handleClose();
            setIsEditMode(false); // Reset edit mode
          }
        }
      } catch (error: any) {
        Swal.fire("Error!", error?.data?.message || "Something went wrong.", "error");
      }
    },
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        ...formik.values,
        ClientNo: data?.data?.ClientNo || "",
        HoldingNo: data?.data?.HoldingNo || "",
        OwnersName: data?.data?.OwnersName || "",
        FHusName: data?.data?.FHusName || "",
        StreetID: data.data.street?.StreetID || "",
        BillingAddress: data?.data?.BillingAddress || "",
        PropTypeID: data?.data?.PropTypeID || 0,
        PropUseID: data?.data?.PropUseID || 0,
        TaxpayerTypeID: data?.data?.TaxpayerTypeID || 0,
        OriginalValue: data?.data?.OriginalValue || 0,
        CurrentValue: data?.data?.CurrentValue || 0,
        Active: data?.data?.Active || "",
        BankNo: data?.data?.BankNo || 0,
        HoldingTax: data?.data?.HoldingTax || 0,
        WaterTax: data?.data?.WaterTax || 0,
        LightingTax: data?.data?.LightingTax || 0,
        ConservancyTax: data?.data?.ConservancyTax || 0,
        Arrear: data?.data?.Arrear || 0,
        ArrStYear: data?.data?.ArrStYear || 0,
        ArrStYear1: data?.data?.ArrStYear1 || 0,
        ArrStPeriod: data?.data?.ArrStPeriod || "",
      });
      setIsEditMode(false); // Default view mode
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-bold text-white">
        <Modal.Title className="text-white">Tax Payer's  {isEditMode ? 'Edit' : 'Search'} </Modal.Title>
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
                <Form.Label htmlFor="HoldingNo">হোল্ডিং নম্বর</Form.Label>
                <Form.Control
                  type="text"
                  id="HoldingNo"
                  name="HoldingNo"
                  placeholder="হোল্ডিং নম্বর"
                  value={formik.values.HoldingNo}
                  onChange={formik.handleChange}
                  required
                  disabled={!isEditMode}
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="OwnersName">করদাতার নাম</Form.Label>
                <Form.Control
                  type="text"
                  id="OwnersName"
                  name="OwnersName"
                  placeholder="করদাতার নাম লিখুন"
                  value={formik.values.OwnersName}
                  onChange={formik.handleChange}
                  required
                  disabled={!isEditMode}
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="fHusName">বাবা / স্বামীর নাম</Form.Label>
                <Form.Control
                  type="text"
                  id="fHusName"
                  name="FHusName"
                  placeholder="বাবা / স্বামীর নাম লিখুন"
                  value={formik.values.FHusName}
                  onChange={formik.handleChange}
                  required
                  disabled={!isEditMode}
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="StreetID">এলাকা / রাস্তার নাম</Form.Label>
                <StreetSelect
                  value={formik.values.StreetID}
                  setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                  disabled={!isEditMode}
                />
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label htmlFor="billingAddress">মোবাইল নম্বর</Form.Label>
                <Form.Control
                  type="text"
                  id="billingAddress"
                  name="BillingAddress"
                  placeholder="মোবাইল নম্বর লিখুন"
                  value={formik.values.BillingAddress}
                  onChange={formik.handleChange}
                  required
                  disabled={!isEditMode}
                />
              </Col>
            </Row>
          </div>

          <Row>
            <Col md={6}>
              <div className="border rounded p-3 pb-2">
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label htmlFor="PropUseID">হোল্ডিং ব্যবহার</Form.Label>
                    <PropUseSelect
                      value={formik.values.PropUseID}
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                      disabled={!isEditMode}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="TaxpayerTypeID">করদাতার ধরন</Form.Label>
                    <TaxpayerTypeSelect
                      value={formik.values.TaxpayerTypeID}
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                      disabled={!isEditMode}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="PropTypeID">হোল্ডিং এর ধরন</Form.Label>
                    <PropTypeSelect
                      value={formik.values.PropTypeID}
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                      disabled={!isEditMode}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label htmlFor="BankNo">ব্যাংক নাম</Form.Label>
                    <BankAccSelect
                      value={formik.values.BankNo}
                      setFieldValue={(field, value) => formik.setFieldValue(field, value)}
                      disabled={!isEditMode}
                    />
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
                      name="CurrentValue"
                      placeholder="বার্ষিক মূল্যমান"
                      value={formik.values.CurrentValue}
                      onChange={formik.handleChange}
                      required
                      disabled={!isEditMode}
                    />
                  </Col>

                  {!isEditMode && (
                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="dueYear">বকেয়ার বছর</Form.Label>
                      <Form.Control
                        type="text"
                        id="ArrStYear"
                        name="ArrStYear" // Formik field name
                        placeholder="বকেয়ার বছর লিখুন"
                        value={`${formik.values.ArrStYear}-${formik.values.ArrStYear1}`}
                        onChange={formik.handleChange} // Formik handleChange
                        disabled

                      />
                    </Col>
                  )}


                  {isEditMode && (
                    <>
                      <Col md={6} className="mb-3">
                        <Form.Label htmlFor="Arrear">বকেয়ার টাকা</Form.Label>
                        <Form.Control
                          type="text"
                          id="Arrear"
                          name="Arrear"
                          placeholder="বকেয়ার টাকা লিখুন"
                          value={formik.values.Arrear}
                          onChange={formik.handleChange}
                          required
                          disabled={!isEditMode}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label htmlFor="ArrStYear">বকেয়ার বছর</Form.Label>
                        <Form.Control
                          type="number"
                          id="ArrStYear"
                          name="ArrStYear"
                          placeholder="বকেয়ার বছর লিখুন"
                          value={formik.values.ArrStYear}
                          onChange={formik.handleChange}
                          disabled={!isEditMode}
                        />
                      </Col>
                    </>
                  )}


                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="ArrStYear1">বকেয়ার বছর ১</Form.Label>
                    <Form.Control
                      type="number"
                      id="ArrStYear1"
                      name="ArrStYear1"
                      placeholder="বকেয়ার বছর লিখুন"
                      value={formik.values.ArrStYear1}
                      onChange={formik.handleChange}
                      disabled={!isEditMode}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="ArrStPeriod">বকেয়ার কিস্তি</Form.Label>
                    <Form.Control
                      type="text"
                      id="ArrStPeriod"
                      name="ArrStPeriod"
                      placeholder="বকেয়ার কিস্তি লিখুন"
                      value={formik.values.ArrStPeriod}
                      onChange={formik.handleChange}
                      disabled={!isEditMode}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Tax Checkboxes */}
          <div className="border rounded mt-3 p-2">
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
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
                disabled={!isEditMode}
              />

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
                disabled={!isEditMode}
              />

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
                disabled={!isEditMode}
              />

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
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-3">


            {isEditMode && (
              <Button
                className="text-white"
                variant="primary"
                onClick={() => setIsEditMode(false)}
              >
                Search
              </Button>
            )}

            {!isEditMode && (
              <Button
                className="text-white"
                variant="warning"
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </Button>
            )}


            <div className="d-flex gap-2">
              <Button
                className="text-white"
                variant="primary"
                onClick={() => navigate("/taxPayer/create")}
              >
                Add
              </Button>


            </div>

            {isEditMode && (
              <div className="d-flex gap-2">
                <Button className="text-white" variant="success" type="submit">
                  Update
                </Button>
              </div>
            )}

            <div className="d-flex gap-2">
              <Button className="text-white" variant="info">
                Single Bill
              </Button>
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

export default TaxPayerSearch;
