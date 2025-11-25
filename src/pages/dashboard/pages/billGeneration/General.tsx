import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useGeneralBillGenerateMutation } from "../../../../redux/api/billGenerateApi";
import { useGetBillYearQuery } from "../../../../redux/api/billYearApi";
import Swal from "sweetalert2";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

// Form values type
interface FormValues {
  year: string;
  year1: string;
  period: string;
  issue_date: string;
  last_date: string;
}

const General: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createTaxPayer, { isLoading }] = useGeneralBillGenerateMutation();

  const { data: activeYear } = useGetBillYearQuery();

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      year: activeYear?.Year || "",
      year1: activeYear?.Year1 || "",
      period: activeYear?.Period_of_bill || "",
      issue_date: "",
      last_date: "",
    },
    validationSchema: Yup.object({
      year: Yup.string().required("Year is required"),
      year1: Yup.string().required("Year1 is required"),
      period: Yup.string().required("Period is required"),
      issue_date: Yup.string().required("Issue Date is required"),
      last_date: Yup.string().required("Last Date is required"),
    }),
    onSubmit: async (values: any, { resetForm }: FormikHelpers<FormValues>) => {
      try {
        setServerErrors({});
        const response = await createTaxPayer(values).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Form submitted successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        console.log("✅ Success Response:", response);
        resetForm();
      } catch (error: any) {
        console.log("❌ Server Error:", error);
        if (error?.data?.errors) {
          setServerErrors(error.data.errors);
        }
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="text-white">বিল জেনারেশন</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            {/* Year */}
            <Col md={4} className="mb-3">
              <Form.Label>অর্থ বছর </Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.year && formik.errors.year)}
              />
              {formik.touched.year && formik.errors.year && (
                <div className="text-danger small">{formik.errors.year}</div>
              )}
              {serverErrors.year && (
                <div className="text-danger small">{serverErrors.year[0]}</div>
              )}
            </Col>

            {/* Year1 */}
            <Col md={4} className="mb-3">
              <Form.Label>Year1</Form.Label>
              <Form.Control
                type="text"
                name="year1"
                value={formik.values.year1}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.year1 && formik.errors.year1)}
              />
              {formik.touched.year1 && formik.errors.year1 && (
                <div className="text-danger small">{formik.errors.year1}</div>
              )}
              {serverErrors.year1 && (
                <div className="text-danger small">{serverErrors.year1[0]}</div>
              )}
            </Col>

            {/* Period */}
            <Col md={4} className="mb-3">
              <Form.Label>কিস্তি</Form.Label>
              <Form.Control
                type="text"
                name="period"
                value={formik.values.period}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.period && formik.errors.period)}
              />
              {formik.touched.period && formik.errors.period && (
                <div className="text-danger small">{formik.errors.period}</div>
              )}
              {serverErrors.period && (
                <div className="text-danger small">{serverErrors.period[0]}</div>
              )}
            </Col>

            {/* Issue Date */}
            <Col md={6} className="mb-3">
              <Form.Label>বিল ইস্যুর তারিখ</Form.Label>
              <Form.Control
                type="date"
                name="issue_date"
                value={formik.values.issue_date}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.issue_date && formik.errors.issue_date)}
              />
              {formik.touched.issue_date && formik.errors.issue_date && (
                <div className="text-danger small">{formik.errors.issue_date}</div>
              )}
              {serverErrors.issue_date && (
                <div className="text-danger small">{serverErrors.issue_date[0]}</div>
              )}
            </Col>

            {/* Last Date */}
            <Col md={6} className="mb-3">
              <Form.Label>পরিশোধের শেষ তারিখ</Form.Label>
              <Form.Control
                type="date"
                name="last_date"
                value={formik.values.last_date}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.last_date && formik.errors.last_date)}
              />
              {formik.touched.last_date && formik.errors.last_date && (
                <div className="text-danger small">{formik.errors.last_date}</div>
              )}
              {serverErrors.last_date && (
                <div className="text-danger small">{serverErrors.last_date[0]}</div>
              )}
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default General;
