import {useState, useEffect, useContext} from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import {useNavigate, useLocation} from 'react-router-dom';
import {Notyf} from 'notyf';
import UserContext from '../UserContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/workouts'




    const {setUser, notyf} = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => setIsActive(email !== '' && password !== ''), [email, password]);


    const authenticate = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok || !data.access) {
                const msg = data.message === 'Incorrect email or password'
                    ? 'Incorrect Credentials. Try Again.'
                    : (data.message || 'Login failed');
                notyf.error(msg);
                return;
            }

            localStorage.setItem('token', data.access);
            await retrieveUserDetails(data.access);     // <-- wait until user is set
            notyf.success('Successful Login');
            navigate(from, { replace: true });          // <-- go to intended route
        } catch {
            notyf.error('Network error. Please try again.');
        } finally {
            setSubmitting(false);
            setEmail('');
            setPassword('');
        }
    };


    const retrieveUserDetails = async (token) => {
        const res = await fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.user?._id) {
            setUser({ id: data.user._id });
        } else {
            setUser({ id: null });
        }
    };

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }

    }, [email, password]);

    return (
        // (user.id !== null) ?

        // 	<Navigate to="/tasks" />

        // 	:

        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4 shadow bg-white rounded" style={{maxWidth: "480px", width: "100%"}}>
                <Form onSubmit={(e) => authenticate(e)}>
                    <h1 className="my-5 text-center">Login</h1>
                    <Form.Group controlId="userEmail" className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="w-100"  variant="primary" disabled={!isActive || submitting}>
                        {submitting ? 'Signing in…' : 'Submit'}
                    </Button>
                </Form>
            </div>
        </Container>
    )
}