// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

// import custom hook
import { useMounted } from "hooks/useMounted";

const ForgetPassword = () => {
  const hasMounted = useMounted();

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100 bg-light">
      <Col xxl={4} lg={5} md={7} xs={12}>
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="py-5 px-6">
            {/* Logo + Title */}
            <div className="mb-5 text-center">
              <Link to="/">
                <Image
                  src="/images/brand/logo/logo.png"
                  alt="Brand Logo"
                  style={{ height: "60px", width: "auto" }}
                  className="mb-3"
                />
              </Link>
              <h3 className="fw-bold mb-2">Forgot Password?</h3>
              <p className="text-muted">
                Don&apos;t worry, we&apos;ll send you an email to reset your password.
              </p>
            </div>

            {hasMounted && (
              <Form>
                {/* Email */}
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

                {/* Reset Button */}
                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-3 py-2 fw-semibold"
                  >
                    Reset Password
                  </Button>
                </div>

                {/* Back to Sign In */}
                <div className="text-center">
                  <span className="text-muted">Remember your password? </span>
                  <Link to="/auth/sign-in" className="fw-semibold text-primary">
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

export default ForgetPassword;
