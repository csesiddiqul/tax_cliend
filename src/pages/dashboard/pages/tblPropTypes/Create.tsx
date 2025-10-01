import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateTblPropTypeMutation } from "../../../../redux/api/tblPropTypeApi";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateTblPropTypeMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    PropTypeID: Yup.string().required("হোল্ডিং টাইপ আইডি প্রযোজ্য !"),
    PropertyType: Yup.string().required("হোল্ডিং টাইপ  প্রযোজ্য !"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      PropTypeID: "",
      PropertyType: "",
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
        <Modal.Title>Tbl Prop Types</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            {/* Prop Type ID */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>হোল্ডিং টাইপ আইডি</Form.Label>
                <Form.Control
                  type="text"
                  name="PropTypeID"
                  placeholder="Enter Prop Type ID"
                  value={formik.values.PropTypeID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.PropTypeID && formik.touched.PropTypeID}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.PropTypeID}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* PropertyType */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>হোল্ডিং এর ধরণ</Form.Label>
                <Form.Control
                  type="text"
                  name="PropertyType"
                  placeholder="Enter PropertyType"
                  value={formik.values.PropertyType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.PropertyType && formik.touched.PropertyType}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.PropertyType}
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
