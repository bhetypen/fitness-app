import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import UserContext from '../UserContext';

const BASE_URL = 'https://fitnessapp-api-ln8u.onrender.com/workouts';

export default function AddWorkoutModal({ show, onClose, onAdded }) {
    const { notyf } = useContext(UserContext);

    const [name, setName] = useState('');
    const [duration, setDuration] = useState('15 mins');
    // API defaults to "pending"; keep it fixed or expose a select if you want
    const [submitting, setSubmitting] = useState(false);

    // Reset fields each time the modal opens
    useEffect(() => {
        if (show) {
            setName('');
            setDuration('15 mins');
            setSubmitting(false);
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            notyf.error('Workout name is required');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${BASE_URL}/addWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    duration,
                    status: 'pending',
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                notyf.error(data.message || 'Failed to add workout');
                setSubmitting(false);
                return;
            }

            // success toast + bubble up to parent
            notyf.success('Workout added!');
            onAdded?.(data); // parent can refetch or optimistic insert
            onClose?.();
        } catch (err) {
            console.error(err);
            notyf.error('Network error. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Workout</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="workoutName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Jumping Jack"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-0" controlId="workoutDuration">
                        <Form.Label>Duration</Form.Label>
                        <Form.Select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option>10 mins</option>
                            <option>15 mins</option>
                            <option>20 mins</option>
                            <option>30 mins</option>
                            <option>45 mins</option>
                            <option>60 mins</option>
                        </Form.Select>
                    </Form.Group>

                    {/* If you want status editable:
          <Form.Group className="mt-3" controlId="workoutStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          */}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? 'Adding…' : 'Add Workout'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
