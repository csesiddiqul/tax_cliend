import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateStreetMutation } from "../../../../redux/api/streetsApi"; 

interface CreateProps {
  show: boolean;

  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateStreetMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    StreetID: Yup.string().required("Street ID is required"),
    StreetName: Yup.string().required("Street Name is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      StreetID: "",
      StreetName: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await createStreet(values).unwrap();
        Swal.fire("Success!", "Street created successfully!", "success");
        resetForm();
        handleClose();
      } catch (error: any) {
        console.log(error);

        // যদি API থেকে validation error আসে
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Street</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          {/* Street ID */}
          <Form.Group className="mb-3">
            <Form.Label>Street ID</Form.Label>
            <Form.Control
              type="text"
              name="StreetID"
              placeholder="Street ID"
              value={formik.values.StreetID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.StreetID && formik.touched.StreetID}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.StreetID}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Street Name */}
          <Form.Group className="mb-3">
            <Form.Label>Street Name</Form.Label>
            <Form.Control
              type="text"
              name="StreetName"
              placeholder="Enter Street Name"
              value={formik.values.StreetName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.StreetName && formik.touched.StreetName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.StreetName}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting || isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Create;
