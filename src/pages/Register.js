import { useState, useContext } from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import userContext from "../UserContext";

const BASE_URL = 'https://fitnessapp-api-ln8u.onrender.com/users';

export default function Register() {
    const {notyf} = useContext(userContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            notyf.error('Email is required');
            return false;
        }
        if (!password) {
            notyf.error('Password is required');
            return false;
        }
        if (password.length < 8) {
            notyf.error('Password must be at least 8 characters');
            return false;
        }
        if (!confirm) {
            notyf.error('Please confirm your password');
            return false;
        }
        if (password !== confirm) {
            notyf.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!validate()) return;

        try {
            const res = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data = {};
            try { data = await res.json(); } catch {}

            if (res.ok) {
                notyf.success('Registration successful! You can now log in.');
                navigate('/login');
            } else {
                notyf.error(data.message || 'Registration failed. Try again.');
            }
        } catch (err) {
            notyf.error('Network error. Try again.');
            console.error(err);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4 shadow bg-white rounded" style={{maxWidth: "480px", width: "100%"}}>
                <Form onSubmit={handleSubmit}>
                    <h1 className="my-5 text-center">Register</h1>

                    <Form.Group controlId="registerEmail" className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="registerPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="registerConfirm" className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button className="w-100" variant="primary" type="submit">Create Account</Button>
                </Form>
            </div>
        </Container>
    );
}
