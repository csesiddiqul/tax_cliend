import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useUpdateTaxPayerTypeMutation } from "../../../../redux/api/taxPayerTypeApi";

interface EditProps {
    show: boolean;
    handleClose: () => void;
    TaxpayerType: any
    refetch: () => void;
}


const Edit: React.FC<EditProps> = ({ show, handleClose, TaxpayerType, refetch }) => {

    console.log(TaxpayerType);

    const [formDataState, setFormDataState] = useState<{ [key: string]: any }>({
        TaxpayerTypeID: "",
        TaxpayerType: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [updateTaxpayerType, { isLoading }] = useUpdateTaxPayerTypeMutation();

    useEffect(() => {
        if (TaxpayerType) {
            setFormDataState({
                TaxpayerTypeID: TaxpayerType.TaxpayerTypeID?.toString() || "",
                TaxpayerType: TaxpayerType.TaxpayerType || "",
            });
            setErrors({});
        }
    }, [TaxpayerType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!TaxpayerType) return;

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("TaxpayerTypeID", TaxpayerType.TaxpayerTypeID?.toString());

        Object.keys(formDataState).forEach((key) => {
            formData.append(key, formDataState[key]);
        });

        try {
            const res: any = await updateTaxpayerType({ id: TaxpayerType.TaxpayerTypeID, data: formData }).unwrap();
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
        TaxpayerType: "ট্যাক্স পেয়ার টাইপ",
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tax Payer Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {Object.keys(fieldLabels).map((key) => (
                        <Form.Group className="mb-3" controlId={key} key={key}>
                            <Form.Label>{fieldLabels[key]}</Form.Label>
                            <Form.Control
                                type="text"
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
                    ))}
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
