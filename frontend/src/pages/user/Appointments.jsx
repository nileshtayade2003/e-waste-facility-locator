import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const Appointments = () => {
    const { user } = useContext(UserContext); // Get logged-in user details
    const [appointments, setAppointments] = useState([]); // All appointments
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [itemsPerPage] = useState(5); // Items per page
    

    // Fetch appointments for the logged-in user
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                
         
                const response = await axios.get('http://localhost:5000/api/user/appointments', {
                    params: { userId: user._id }, // Send userId as query param
                });
                

                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
  
                } else {
                    console.error('Expected an array but got:', response.data);
                    setAppointments([]); // Set to empty array to avoid errors
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchAppointments();
        } else {
            setLoading(false); // Stop loading if user is not available
        }
    }, [user]); // Re-run when user changes

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning text-white';
            case 'approved':
                return 'bg-success text-white';
            case 'rejected':
                return 'bg-danger text-white';
            case 'completed':
                return 'bg-primary text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

   
    return (
        <div className="container-fluid mt-5">
             <h2 className="mb-4 text-center" style={{ marginTop: "70px" }}>Your Appointments</h2>

            {appointments.length === 0 ? (
                <p className="text-center text-muted">No appointments found.</p>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Center</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>
                                            <div className="fw-bold">{appointment.center?.name}</div>
                                            <div className="text-muted">{appointment.center?.address}</div>
                                        </td>
                                        <td>{appointment.productName}</td>
                                        <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                        <td>{appointment.appointmentTime}</td>
                                        <td>
                                            <span className={`badge ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                            {Array.from(
                                { length: Math.ceil(appointments.length / itemsPerPage) },
                                (_, i) => (
                                    <li
                                        key={i + 1}
                                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        <button
                                            onClick={() => paginate(i + 1)}
                                            className="page-link"
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default Appointments;