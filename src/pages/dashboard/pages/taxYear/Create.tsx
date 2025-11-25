import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCreateTaxRateMutation } from "../../../../redux/api/taxRatesApi";

interface CreateProps {
  show: boolean;
  handleClose: () => void;
}

const Create: React.FC<CreateProps> = ({ show, handleClose }) => {
  const [createStreet, { isLoading }] = useCreateTaxRateMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    Id: Yup.number().required("কর আইডি প্রযোজ্য !"),
    HoldingT: Yup.number().required("হোল্ডিং কর প্রযোজ্য !"),
    ConservancyT: Yup.number().required("সংরক্ষণ রেইট প্রযোজ্য !"),
    WaterT: Yup.number().required("পানি রেইট প্রযোজ্য !"),
    LightT: Yup.number().required("বিদ্যুৎ রেইট প্রযোজ্য !"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      Id: "",
      HoldingT: "",
      ConservancyT: "",
      WaterT: "",
      LightT: "",
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
        <Modal.Title>Tax Rates </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            {/* Prop Type ID */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>কর আইডি  </Form.Label>
                <Form.Control
                  type="text"
                  name="Id"
                  placeholder=""
                  value={formik.values.Id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.Id && formik.touched.Id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.Id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* হোল্ডিং কর */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>হোল্ডিং কর</Form.Label>
                <Form.Control
                  type="number"
                  name="HoldingT"
                  placeholder=""
                  value={formik.values.HoldingT}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.HoldingT && formik.touched.HoldingT}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.HoldingT}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* সংরক্ষণ রেইট */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>সংরক্ষণ রেইট</Form.Label>
                <Form.Control
                  type="number"
                  name="ConservancyT"
                  placeholder=""
                  value={formik.values.ConservancyT}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.ConservancyT && formik.touched.ConservancyT}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ConservancyT}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* পানি রেইট */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>পানি রেইট</Form.Label>
                <Form.Control
                  type="number"
                  name="WaterT"
                  placeholder=""
                  value={formik.values.WaterT}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.WaterT && formik.touched.WaterT}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.WaterT}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {/* বিদ্যুৎ রেইট */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>বিদ্যুৎ রেইট</Form.Label>
                <Form.Control
                  type="number"
                  name="LightT"
                  placeholder=""
                  value={formik.values.LightT}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.LightT && formik.touched.LightT}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.LightT}
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
