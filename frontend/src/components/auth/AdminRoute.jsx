import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import axios from 'axios';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);

                if (session) {
                    // Call backend to get role
                    // Note: In production, use the backend URL from environment variables
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/get-user-role`, {
                        userId: session.user.id
                    });

                    if (response.data.role === 'admin') {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error('Error checking admin role:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUserRole();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
