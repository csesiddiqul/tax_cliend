// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

// import custom hook
import { useMounted } from "hooks/useMounted";

const SignUp = () => {
  const hasMounted = useMounted();

  return (
    <Row className="align-items-center justify-content-center g-0 my-5 min-vh-100 bg-light">
      <Col xxl={4} lg={6} md={7} xs={12}>
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="px-5 py-6">
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
              <h3 className="fw-bold mb-2">Create Your Account</h3>
              <p className="text-muted">Fill in your details to get started</p>
            </div>

            {hasMounted && (
              <Form>
                {/* Username */}
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label className="fw-semibold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

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

                {/* Password */}
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-4" controlId="confirm-password">
                  <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm-password"
                    placeholder="Confirm your password"
                    className="rounded-3 py-2"
                    required
                  />
                </Form.Group>

                {/* Terms Checkbox */}
                <div className="mb-4">
                  <Form.Check type="checkbox" id="terms-check">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label className="ms-2">
                      I agree to the{" "}
                      <Link to="#" className="text-primary fw-semibold">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="#" className="text-primary fw-semibold">
                        Privacy Policy
                      </Link>
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-3 py-2 fw-semibold"
                  >
                    Create Free Account
                  </Button>
                </div>

                {/* Links */}
                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/auth/sign-in" className="fw-semibold text-primary">
                    Login
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

export default SignUp;
