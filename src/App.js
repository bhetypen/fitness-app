import {useState, useEffect, useMemo} from 'react';
import {Container} from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import UserContext, {UserProvider} from './UserContext';
import Register from "./pages/Register";
import {Notyf} from 'notyf';
import 'notyf/notyf.min.css';
import Workouts from "./pages/Workouts";
import AppNavbar from "./components/AppNavbar";
import RequireAuth from "./components/RequireAuth";

function App() {
    const [user, setUser] = useState({id: null});
    const [authReady, setAuthReady] = useState(false);

    const notyf = useMemo(() => new Notyf({
        duration: 2500,
        position: {x: 'right', y: 'top'}
    }), [])


    const unsetUser = () => {
        localStorage.clear();
        setUser({id: null});
    };

    // optional: restore user details if token exists
    useEffect(() => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser({id: data.user._id});
                } else {
                    setUser({id: null});
                }
            })
            .catch(() => setUser({id: null}))
            .finally(() => setAuthReady(true));
    }, []);

    return (
        <UserProvider value={{user, setUser, unsetUser, notyf}}>
            <Router>
                <AppNavbar bg="dark" variant="dark" expand="lg"></AppNavbar>
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>

                        {/*Protected Route*/}
                        <Route path="/workouts" element={
                            <RequireAuth>
                                <Workouts/>
                            </RequireAuth>
                        }/>
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
