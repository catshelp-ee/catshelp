import {useEffect, useState} from 'react';
import {usersApi} from "@api/users.service.ts";
import {UserResponse} from "@interfaces/user-response.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@context/auth-context.tsx";

export function useUser() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const url = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const {getUser} = useAuth();

    useEffect(() => {

        // Prevent state updates after component unmounts
        // Example: User navigates away at 100ms, API returns at 500ms
        // Without this check, setUser() would run on unmounted component → warning/error
        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const userLoggedIn = await getUser();
                const userId = url.pathname === "/users"
                    ? userLoggedIn.id
                    : Number(params.userId);

                const fetchedUser = await usersApi.getUser(userId);

                if (isMounted) {
                    setUser(fetchedUser);
                }
            } catch (e) {
                if (isMounted) {
                    setError(e as Error);
                    const userLoggedIn = await getUser();
                    navigate(`/users/${userLoggedIn.id}`);
                }
                console.error("Error fetching user: ", e);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser().catch((e) => {
            console.error("Unexpected error in fetchUser: ", e);
        });

        return () => {
            isMounted = false;
        };
    }, [getUser, navigate, params.userId, url.pathname]);

    return {user, loading, error};
}