import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useGovtBillGenerateMutation } from "../../../../redux/api/billGenerateApi";
import Swal from "sweetalert2";
import { useGetBillYearQuery } from "redux/api/billYearApi";

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
  surcharge: string;
  rebate: string;
}

const Govt: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createTaxPayer, { isLoading }] = useGovtBillGenerateMutation();

  const { data: activeYear } = useGetBillYearQuery();

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      year: activeYear?.Year || "",
      year1: activeYear?.Year1 || "",
      period: activeYear?.Period_of_bill || "",
      issue_date: "",
      last_date: "",
      surcharge: "",
      rebate: "",
    },
    validationSchema: Yup.object({
      year: Yup.string().required("Year is required"),
      year1: Yup.string().required("Year1 is required"),
      period: Yup.string().required("Period is required"),
      issue_date: Yup.string().required("Issue Date is required"),
      last_date: Yup.string().required("Last Date is required"),
      // surcharge: Yup.string().required("Surcharge is required"),
      // rebate: Yup.string().required("Rebate is required"),
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

  const renderError = (field: keyof FormValues) =>
    (formik.touched[field] && formik.errors[field] ? formik.errors[field] : null) ||
    (serverErrors[field]?.[0] ?? null);

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
              <Form.Label>অর্থ বছর</Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                isInvalid={!!renderError("year")}
              />
              {renderError("year") && <div className="text-danger small">{renderError("year")}</div>}
            </Col>

            {/* Year1 */}
            <Col md={4} className="mb-3">
              <Form.Label>Year1</Form.Label>
              <Form.Control
                type="text"
                name="year1"
                value={formik.values.year1}
                onChange={formik.handleChange}
                isInvalid={!!renderError("year1")}
              />
              {renderError("year1") && <div className="text-danger small">{renderError("year1")}</div>}
            </Col>

            {/* Period */}
            <Col md={4} className="mb-3">
              <Form.Label>কিস্তি</Form.Label>
              <Form.Control
                type="text"
                name="period"
                value={formik.values.period}
                onChange={formik.handleChange}
                isInvalid={!!renderError("period")}
              />
              {renderError("period") && <div className="text-danger small">{renderError("period")}</div>}
            </Col>

            {/* Issue Date */}
            <Col md={6} className="mb-3">
              <Form.Label>বিল ইস্যুর তারিখ</Form.Label>
              <Form.Control
                type="date"
                name="issue_date"
                value={formik.values.issue_date}
                onChange={formik.handleChange}
                isInvalid={!!renderError("issue_date")}
              />
              {renderError("issue_date") && <div className="text-danger small">{renderError("issue_date")}</div>}
            </Col>

            {/* Last Date */}
            <Col md={6} className="mb-3">
              <Form.Label>পরিশোধের শেষ তারিখ</Form.Label>
              <Form.Control
                type="date"
                name="last_date"
                value={formik.values.last_date}
                onChange={formik.handleChange}
                isInvalid={!!renderError("last_date")}
              />
              {renderError("last_date") && <div className="text-danger small">{renderError("last_date")}</div>}
            </Col>

            {/* Surcharge */}
            <Col md={6} className="mb-3">
              <Form.Label>সারচার্জ</Form.Label>
              <Form.Control
                type="text"
                name="surcharge"
                value={formik.values.surcharge}
                onChange={formik.handleChange}
                isInvalid={!!renderError("surcharge")}
              />
              {renderError("surcharge") && <div className="text-danger small">{renderError("surcharge")}</div>}
            </Col>

            {/* Rebate */}
            <Col md={6} className="mb-3">
              <Form.Label>রিবেট</Form.Label>
              <Form.Control
                type="text"
                name="rebate"
                value={formik.values.rebate}
                onChange={formik.handleChange}
                isInvalid={!!renderError("rebate")}
              />
              {renderError("rebate") && <div className="text-danger small">{renderError("rebate")}</div>}
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

export default Govt;
