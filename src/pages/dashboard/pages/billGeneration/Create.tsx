import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateBankAccountMutation } from "../../../../redux/api/bankAccountApi";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateBankAccountMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    BankNo: Yup.string().required("Bank Account No is required"),
    BankName: Yup.string().required("Bank Name is required"),
    Branch: Yup.string().required("Bank Branch is required"),
    AccountsNo: Yup.string().required("Accounts No is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      BankNo: "",
      BankName: "",
      Branch: "",
      AccountsNo: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await createStreet(values).unwrap();
        Swal.fire("Success!", "Bank Account created successfully!", "success");
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
        <Modal.Title>Add Bank Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            {/* Bank No */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bank No</Form.Label>
                <Form.Control
                  type="text"
                  name="BankNo"
                  placeholder="Enter Bank No"
                  value={formik.values.BankNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.BankNo && formik.touched.BankNo}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.BankNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Bank Name */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  name="BankName"
                  placeholder="Enter Bank Name"
                  value={formik.values.BankName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.BankName && formik.touched.BankName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.BankName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Branch */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="Branch"
                  placeholder="Enter Branch"
                  value={formik.values.Branch}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.Branch && formik.touched.Branch}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.Branch}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Accounts No */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Accounts No</Form.Label>
                <Form.Control
                  type="text"
                  name="AccountsNo"
                  placeholder="Enter Accounts No"
                  value={formik.values.AccountsNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.AccountsNo && formik.touched.AccountsNo
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.AccountsNo}
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
    </Modal>
  );
};

export default Create;
