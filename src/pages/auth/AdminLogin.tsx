import { useState, FormEvent, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser } from "../../redux/slice/authSlice";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { roles, status, token } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ phone, password })).unwrap();
            Swal.fire("Success!", "Admin Login Successful", "success");
        } catch (error: any) {
            setError(error?.message || "Invalid credentials");
        }
    };

    useEffect(() => {
        if (status === "succeeded" && token) {
            if (roles.includes("admin") || roles.includes("administration")) {
                navigate("/dashboard");
            }
        }
    }, [status, token, roles, navigate]);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter admin phone number"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                        <i className={showPassword ? "fe fe-eye-off" : "fe fe-eye"}></i>
                    </span>
                </div>
            </Form.Group>

            {error && <p className="text-danger small">{error}</p>}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check label="Remember me" />
                <Link to="/auth/forget-password" className="text-primary fw-semibold">
                    Forgot password?
                </Link>
            </div>

            <div className="d-grid mb-4">
                <Button type="submit" variant="primary" className="rounded-3 py-2 fw-semibold">
                    Sign In as Admin
                </Button>
            </div>
        </Form>
    );
};

export default AdminLogin;
