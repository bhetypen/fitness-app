import { useEffect, useState, useContext } from 'react';
import { Button, Table, Stack } from 'react-bootstrap';
import AddWorkoutModal from '../components/AddWorkoutModal';
import UserContext from '../UserContext';

const BASE_URL = 'https://fitnessapp-api-ln8u.onrender.com/workouts';

export default function Workouts() {
    const { notyf } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [workouts, setWorkouts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/getMyWorkouts`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                notyf.error(data.message || 'Failed to load workouts');
                setLoading(false);
                return;
            }
            setWorkouts(data.workouts || []);
        } catch (e) {
            console.error(e);
            notyf.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleAdded = (newWorkout) => {
        // Optimistic insert at top
        setWorkouts((prev) => [newWorkout, ...prev]);
    };

    return (
        <>
            <Stack direction="horizontal" className="my-4" gap={3}>
                <h2 className="mb-0">My Workouts</h2>
                <div className="ms-auto">
                    <Button onClick={() => setShowAdd(true)}>+ Add Workout</Button>
                </div>
            </Stack>

            {loading ? (
                <p>Loading…</p>
            ) : workouts.length === 0 ? (
                <p>No workouts yet. Click &ldquo;Add Workout&rdquo; to create one.</p>
            ) : (
                <Table striped hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Date Added</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workouts.map((w) => (
                        <tr key={w._id}>
                            <td>{w.name}</td>
                            <td>{w.duration}</td>
                            <td>{w.status}</td>
                            <td>{new Date(w.dateAdded).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <AddWorkoutModal
                show={showAdd}
                onClose={() => setShowAdd(false)}
                onAdded={handleAdded} // or pass fetchWorkouts to refetch
            />
        </>
    );
}
