import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useUpdateTaxRateMutation } from "../../../../redux/api/taxRatesApi";

interface EditProps {
    show: boolean;
    handleClose: () => void;
    TaxRate: any
    refetch: () => void;
}


const Edit: React.FC<EditProps> = ({ show, handleClose, TaxRate, refetch }) => {

    console.log(TaxRate);

    const [formDataState, setFormDataState] = useState<{ [key: string]: any }>({
        Id: "",
        HoldingT: "",
        ConservancyT: "",
        WaterT: "",
        LightT: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [updateTaxRate, { isLoading }] = useUpdateTaxRateMutation();

    useEffect(() => {
        if (TaxRate) {
            setFormDataState({
                Id: TaxRate.Id?.toString() || "",
                HoldingT: TaxRate.HoldingT || "",
                ConservancyT: TaxRate.ConservancyT || "",
                WaterT: TaxRate.WaterT || "",
                LightT: TaxRate.LightT || "",
            });
            setErrors({});
        }
    }, [TaxRate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!TaxRate) return;

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("Id", TaxRate.Id);

        Object.keys(formDataState).forEach((key) => {
            formData.append(key, formDataState[key]);
        });

        try {
            const res: any = await updateTaxRate({ id: TaxRate.Id, data: formData }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: res?.message || "updated successfully!",
            });
            refetch();
            handleClose();
        } catch (err: any) {
            const fieldErrors = err?.data?.data;
            if (fieldErrors && Object.keys(fieldErrors).length > 0) {
                const newErrors: { [key: string]: string } = {};
                Object.keys(fieldErrors).forEach((key) => {
                    newErrors[key] = fieldErrors[key][0];
                });
                setErrors(newErrors);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.data?.message || "Update failed!",
                });
            }
        }
    };

    // ফিল্ড লেবেল সুন্দরভাবে দেখানোর জন্য mapping
    const fieldLabels: { [key: string]: string } = {
        Id: "কর আইডি",
        HoldingT: "হোল্ডিং কর",
        ConservancyT: "সংরক্ষণ রেইট",
        WaterT: "পানি রেইট",
        LightT: "বিদ্যুৎ রেইট",
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tax Payer Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        {Object.keys(fieldLabels).map((key) => (
                            <Col md={6} key={key}>
                                <Form.Group className="mb-3" controlId={key}>
                                    <Form.Label>{fieldLabels[key]}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name={key}
                                        value={formDataState[key] || ""}
                                        onChange={handleChange}
                                        isInvalid={!!errors[key]}
                                        placeholder={`${fieldLabels[key]}`}
                                    />
                                    {errors[key] && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors[key]}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Edit;
