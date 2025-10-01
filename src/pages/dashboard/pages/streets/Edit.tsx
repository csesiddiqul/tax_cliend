import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useUpdateStreetMutation } from "../../../../redux/api/streetsApi";

interface EditProps {
    show: boolean;
    handleClose: () => void;
    street: any | null;
}

const Edit: React.FC<EditProps> = ({ show, handleClose, street }) => {
    const [formDataState, setFormDataState] = useState<{ [key: string]: any }>({
        StreetName: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // generic field errors
    const [updateStreet, { isLoading }] = useUpdateStreetMutation();

    useEffect(() => {
        if (street) {
            setFormDataState({
                StreetName: street.StreetName || "",
            });
            setErrors({}); // reset errors
        }
    }, [street]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!street) return;

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("StreetID", street.StreetID?.toString());

        Object.keys(formDataState).forEach((key) => {
            formData.append(key, formDataState[key]);
        });
        try {
            const res: any = await updateStreet({ id: street.StreetID, data: formData }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: res?.message || "Street updated successfully!",
            });
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

    return (
        <Modal show={show}
            onHide={handleClose}
            centered
            
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Street</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {Object.keys(formDataState).map((key) => (
                        <Form.Group className="mb-3" controlId={key} key={key}>
                            <Form.Label>{key}</Form.Label>
                            <Form.Control
                                type="text"
                                name={key}
                                value={formDataState[key]}
                                onChange={handleChange}
                                isInvalid={!!errors[key]}
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
