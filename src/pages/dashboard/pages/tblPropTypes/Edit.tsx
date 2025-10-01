import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useUpdateTblPropTypeMutation } from "../../../../redux/api/tblPropTypeApi";

interface EditProps {
    show: boolean;
    handleClose: () => void;
    TblPropType: any
    refetch: () => void;
}

const Edit: React.FC<EditProps> = ({ show, handleClose, TblPropType, refetch }) => {
    const [formDataState, setFormDataState] = useState<{ [key: string]: any }>({
        PropTypeID: "",
        PropertyType: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [updateTblPropType, { isLoading }] = useUpdateTblPropTypeMutation();

    useEffect(() => {
        if (TblPropType) {
            setFormDataState({
                PropTypeID: TblPropType.PropTypeID?.toString() || "",
                PropertyType: TblPropType.PropertyType || "",
            });
            setErrors({});
        }
    }, [TblPropType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!TblPropType) return;

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("PropTypeID", TblPropType.PropTypeID?.toString());

        Object.keys(formDataState).forEach((key) => {
            formData.append(key, formDataState[key]);
        });

        try {
            const res: any = await updateTblPropType({ id: TblPropType.PropTypeID, data: formData }).unwrap();
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
        PropertyType: "হোল্ডিং এর ধরণ",
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tbl Prop Types</Modal.Title>
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
                                placeholder={`Enter ${fieldLabels[key]}`}
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
