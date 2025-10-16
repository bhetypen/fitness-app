import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
    const { user, unsetUser, notyf } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        unsetUser();                // clears token + resets user
        notyf?.success('Logged out');
        navigate('/login', { replace: true });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">FitnessApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        {user && user.id ? (
                            <>
                                <Nav.Link as={Link} to="/workouts">My Workouts</Nav.Link>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="ms-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
