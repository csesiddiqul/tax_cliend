import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const PaymentModal = () => {
    const [show, setShow] = useState(false);

    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            {/* Pay Button */}
            <Button
                variant="success"
                className="px-4 fw-bold"
                onClick={handleOpen}
            >
                Pay
            </Button>

            {/* Payment Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">
                        🧾 Choose Your Payment Method
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="pb-4">
                    <div className="d-flex flex-column gap-3">

                        {/* Bkash */}
                        <Button
                            size="lg"
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 border-0 shadow-sm payment-btn bkash-btn"
                            onClick={() => alert("Bkash Selected")}
                        >
                            <span style={{ fontSize: "22px" }}>📲</span>
                            <span className="fw-bold">bKash Payment</span>
                        </Button>

                        {/* Nagad */}
                        <Button
                            size="lg"
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 border-0 shadow-sm payment-btn nagad-btn"
                            onClick={() => alert("Nagad Selected")}
                        >
                            <span style={{ fontSize: "22px" }}>💳</span>
                            <span className="fw-bold">Nagad Payment</span>
                        </Button>

                        {/* Rocket */}
                        <Button
                            size="lg"
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 border-0 shadow-sm payment-btn rocket-btn"
                            onClick={() => alert("Rocket Selected")}
                        >
                            <span style={{ fontSize: "22px" }}>🚀</span>
                            <span className="fw-bold">Rocket Payment</span>
                        </Button>

                    </div>
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button
                        variant="outline-secondary"
                        className="px-4"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Extra CSS */}
            <style>
                {`
                .payment-btn {
                    transition: all 0.25s ease;
                }
                .payment-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.15);
                }
                .bkash-btn {
                    background-color: #E3106E;
                    color: white;
                }
                .nagad-btn {
                    background-color: #F6A500;
                    color: #222;
                }
                .rocket-btn {
                    background-color: #7D3C98;
                    color: white;
                }
                `}
            </style>
        </>
    );
};

export default PaymentModal;
