import {useState, useEffect, useContext} from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {Notyf} from 'notyf';
import UserContext from '../UserContext';

export default function Login() {
    const navigate = useNavigate();

    const notyf = new Notyf();


    const {user, setUser} = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {

            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
            .then(res => res.json())
            .then(data => {

                if (data.access !== undefined) {

                    console.log(data.access);

                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);

                    notyf.success('Successful Login');
                    navigate('/workouts')

                } else if (data.message == "Incorrect email or password") {
                    notyf.error("Incorrect Credentials. Try Again.");
                } else {
                    notyf.error('User Not Found. Try Again.');
                }
            })

        setEmail('');
        setPassword('');


    }


    const retrieveUserDetails = (token) => {

        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {

                console.log(data);
                console.log(data.user._id);

                setUser({
                    id: data.user._id,
                });

            })

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

                    {isActive ?
                        <Button variant="primary" type="submit" id="submitBtn">
                            Submit
                        </Button>
                        :
                        <Button variant="danger" type="submit" id="submitBtn" disabled>
                            Submit
                        </Button>
                    }
                </Form>
            </div>
        </Container>
    )
}