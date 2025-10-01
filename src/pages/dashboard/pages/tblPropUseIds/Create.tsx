import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateTblPropUseIdMutation } from "../../../../redux/api/tblPropUseIdApi";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateTblPropUseIdMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    PropUseID: Yup.string().required("প্রপ ইউজ আইডি প্রযোজ্য !"),
    PropertyUse: Yup.string().required("হোল্ডিং ব্যবহার  প্রযোজ্য !"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      PropUseID: "",
      PropertyUse: "",
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
        <Modal.Title>Tbl Prop Use ID </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            {/* Prop Type ID */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>প্রপ ইউজ আইডি</Form.Label>
                <Form.Control
                  type="text"
                  name="PropUseID"
                  placeholder=""
                  value={formik.values.PropUseID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.PropUseID && formik.touched.PropUseID}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.PropUseID}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* PropertyUse */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>হোল্ডিং ব্যবহার</Form.Label>
                <Form.Control
                  type="text"
                  name="PropertyUse"
                  placeholder=""
                  value={formik.values.PropertyUse}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.PropertyUse && formik.touched.PropertyUse}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.PropertyUse}
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
