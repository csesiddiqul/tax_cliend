import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateTaxPayerTypeMutation } from "../../../../redux/api/taxPayerTypeApi";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateTaxPayerTypeMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    TaxpayerTypeID: Yup.string().required("প্রপ ইউজ আইডি প্রযোজ্য !"),
    TaxpayerType: Yup.string().required("হোল্ডিং ব্যবহার  প্রযোজ্য !"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      TaxpayerTypeID: "",
      TaxpayerType: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await createStreet(values).unwrap();
        Swal.fire("Success!", "created successfully!", "success");
        resetForm();
        handleClose();
      } catch (error: any) {
        if (error?.data?.data) {
          const apiErrors: Record<string, string> = {};
          Object.keys(error.data.data).forEach((field) => {
            apiErrors[field] = error.data.data[field][0];
          });
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
      <Modal.Header closeButton>
        <Modal.Title>Tax Payer Type </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            {/* Prop Type ID */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ট্যাক্স পেয়ার টাইপ আইডি  </Form.Label>
                <Form.Control
                  type="text"
                  name="TaxpayerTypeID"
                  placeholder=""
                  value={formik.values.TaxpayerTypeID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.TaxpayerTypeID && formik.touched.TaxpayerTypeID}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.TaxpayerTypeID}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* TaxpayerType */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ট্যাক্স পেয়ার টাইপ</Form.Label>
                <Form.Control
                  type="text"
                  name="TaxpayerType"
                  placeholder=""
                  value={formik.values.TaxpayerType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.TaxpayerType && formik.touched.TaxpayerType}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.TaxpayerType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export default Create;
