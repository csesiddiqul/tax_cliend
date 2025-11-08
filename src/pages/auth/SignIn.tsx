//import node module libraries
import { useState, FormEvent, useEffect } from "react";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../redux/slice/authSlice";
import { AppDispatch, RootState } from "../../redux/store";
import Swal from "sweetalert2";

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { roles, status, token } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [apiErr, setApiErr] = useState("");



  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ phone, password })).unwrap();
      Swal.fire({
        title: "Success!",
        text: "Login Successful",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error: any) {
      setPhoneErr(error?.data?.phone);
      setPasswordErr(error?.errors?.password);
      setApiErr(error?.errors?.phone);
    }
  };

  useEffect(() => {
    if (status === "succeeded" && token) {
      if (roles.includes("administration") || roles.includes("admin")) {
        navigate("/dashboard");
      } else if (roles.includes("guest") || roles.includes("user")) {
        navigate("/userpanel");
      } else {
        navigate("/unauthorized");
      }
    }
  }, [status, token, navigate, roles]);

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100 bg-light">
      <Col xxl={4} lg={5} md={7} xs={12}>
        <Card className="shadow-sm border-0 rounded-4">
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
              <h3 className="fw-bold mb-2">Admin 👋</h3>
              <p className="text-muted">Please sign in to continue</p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Phone Number */}
              <Form.Group className="mb-4" controlId="phone">
                <Form.Label className="fw-semibold">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="rounded-3 py-2"
                  required
                />
                {phoneErr && <p className="text-danger small mt-1">{phoneErr}</p>}
                {apiErr && <p className="text-danger small mt-1">{apiErr}</p>}
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="rounded-3 py-2 pe-5"
                    required
                  />
                  <span
                    onClick={togglePassword}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "15px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    <i
                      className={showPassword ? "fe fe-eye-off" : "fe fe-eye"}
                    ></i>
                  </span>
                </div>
                {passwordErr && (
                  <p className="text-danger small mt-1">{passwordErr}</p>
                )}
              </Form.Group>

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" id="rememberme">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label className="ms-2">
                    Remember me
                  </Form.Check.Label>
                </Form.Check>
               
              </div>

              {/* Sign In Button */}
              <div className="d-grid mb-4">
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-3 py-2 fw-semibold"
                >
                  Sign In
                </Button>
              </div>

              {/* Create account link */}
              <div className="text-center">
                <span className="text-muted">Client </span>
                <Link
                  to="/client/sign-in"
                  className="fw-semibold text-primary"
                >
                   Login Page
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
