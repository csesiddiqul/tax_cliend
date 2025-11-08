// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useResendVerifyPhoneMutation } from "redux/api/rtkAuthApi";
import { useMounted } from "hooks/useMounted";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
const ClientVerifyPhone = () => {
  const hasMounted = useMounted();

  const navigate = useNavigate();

  const [
    resendVerifyPhone,
    { isLoading },
  ] = useResendVerifyPhoneMutation();

  const { user } = useSelector((state: any) => state.auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const ClientNo = formData.get("ClientNo");

    try {
      const response = await resendVerifyPhone({ ClientNo }).unwrap();
      console.log("API Response:", response);

      Swal.fire({
        text: "Verification code has been sent successfully!",
        icon: "success",
      });

      navigate('/client/otp-submit')

    } catch (err: any) {
      alert(err?.data?.message || "Failed to resend verification code");
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100 bg-light">
      <Col xxl={4} lg={5} md={7} xs={12}>
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="py-5 px-6">
            <div className="mb-5 text-center">
              <Link to="/">
                <Image
                  src="/images/brand/logo/logo.png"
                  alt="Brand Logo"
                  style={{ height: "60px", width: "auto" }}
                  className="mb-3"
                />
              </Link>
              <h3 className="fw-bold mb-2">Phone Verification</h3>

              <p className="text-muted">
                Don&apos;t worry, we&apos;ll send an OTP to your phone number:{" "}
                <span className="fw-semibold">
                  {user?.client?.BillingAddress || "N/A"}
                </span>
              </p>
            </div>


            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="ClientNo">
                  <Form.Label className="fw-semibold">ClientNo</Form.Label>
                  <Form.Control
                    type="text"
                    name="ClientNo"
                    value={user?.client?.ClientNo}
                    placeholder="Enter your ClientNo"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-3 py-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Otp"}
                  </Button>
                </div>

                <div className="text-center">
                  <span className="text-muted">Remember your password? </span>
                  <Link to="/client/sign-in" className="fw-semibold text-primary">
                    Sign In
                  </Link>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ClientVerifyPhone;
