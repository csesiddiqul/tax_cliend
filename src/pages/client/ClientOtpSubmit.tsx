import { useState } from "react";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useResendVerifyPhoneMutation, useOtpVerifyPhoneMutation } from "redux/api/rtkAuthApi";
import { useMounted } from "hooks/useMounted";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { logout } from "redux/slice/authSlice";
const ClientOtpSubmit = () => {
  const hasMounted = useMounted();
  // const navigate = useNavigate();
  const dispatch = useDispatch();


  const [resendVerifyPhone, { isLoading: isResending }] = useResendVerifyPhoneMutation();
  const [otpVerifyPhone, { isLoading: isSendOtpLoading }] = useOtpVerifyPhoneMutation();

  // localStorage.setItem('user', JSON.stringify(data));


  const { user } = useSelector((state: any) => state.auth);

  const [formError, setFormError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setFormError(null);
    try {
      const response = await resendVerifyPhone({ ClientNo: user?.client?.ClientNo }).unwrap();

      Swal.fire({
        text: response?.message || "OTP has been resent successfully!",
        icon: "success",
      });



    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const ClientNo = formData.get("ClientNo")?.toString();
    const code = formData.get("code")?.toString();

    if (!ClientNo || !code) {
      setFormError("ClientNo and OTP are required");
      return;
    }

    try {
      const response = await otpVerifyPhone({ ClientNo, code }).unwrap();
      Swal.fire({
        title: 'Please Login again',
        text: response?.message || "Please Login again",
        icon: "success",
        // timer: 3000,
        showConfirmButton: true,
      });
      // navigate("/client/sign-in");
      dispatch(logout());
      localStorage.removeItem("token");



    } catch (err: any) {
      // এখানে inline error show করবে
      setFormError(err?.data?.message || "Failed to verify OTP");
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
              <h3 className="fw-bold mb-0">Phone Verification</h3>
              <p className="text-muted">
                Don&apos;t worry, we&apos;ll send an OTP to your phone number:{" "}
                <span className="fw-semibold">
                  {user?.client?.BillingAddress || "N/A"}
                </span>
              </p>

              <Button
                variant="secondary"
                className="mb-0"
                onClick={handleSendOtp}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend Otp"}
              </Button>
            </div>

            {hasMounted && (
              <Form onSubmit={handleSubmit}>
                {formError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {formError}
                  </div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">ClientNo</Form.Label>
                  <Form.Control
                    type="text"
                    name="ClientNo"
                    value={user?.client?.ClientNo || ''}
                    placeholder="Enter your ClientNo"
                    className="rounded-3 py-2"
                    required
                  />
                  <Form.Label className="fw-semibold mt-3">Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    placeholder="Enter Your OTP"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-3 py-2 fw-semibold"
                    disabled={isSendOtpLoading}
                  >
                    {isSendOtpLoading ? "Sending..." : "Submit OTP"}
                  </Button>
                </div>

                <div className="text-center">
                  <span className="text-muted">Client  </span>
                  <Link to="/client/sign-in" className="fw-semibold text-primary">
                    Login Page
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

export default ClientOtpSubmit;
