import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useUpdateBankAccountMutation } from "../../../../redux/api/bankAccountApi";

interface EditProps {
    show: boolean;
    handleClose: () => void;
    bankAccount: any
    refetch: () => void;
}

const Edit: React.FC<EditProps> = ({ show, handleClose, bankAccount, refetch }) => {
    const [formDataState, setFormDataState] = useState<{ [key: string]: any }>({
        BankName: "",
        Branch: "",
        AccountsNo: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [updatebankAccount, { isLoading }] = useUpdateBankAccountMutation();

    useEffect(() => {
        if (bankAccount) {
            setFormDataState({
                BankNo: bankAccount.BankNo?.toString() || "",
                BankName: bankAccount.BankName || "",
                Branch: bankAccount.Branch || "",
                AccountsNo: bankAccount.AccountsNo || "",
            });
            setErrors({});
        }
    }, [bankAccount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!bankAccount) return;

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("BankNo", bankAccount.BankNo?.toString());

        Object.keys(formDataState).forEach((key) => {
            formData.append(key, formDataState[key]);
        });

        try {
            const res: any = await updatebankAccount({ id: bankAccount.BankNo, data: formData }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: res?.message || "Bank account updated successfully!",
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
        BankName: "Bank Name",
        Branch: "Branch Name",
        AccountsNo: "Account Number",
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Bank Information</Modal.Title>
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
