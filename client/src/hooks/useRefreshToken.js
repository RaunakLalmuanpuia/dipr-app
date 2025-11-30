import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/refresh', {
                withCredentials: true
            });

            console.log('Refresh response:', response.data); // Debug log

            setAuth(prev => {
                console.log('Previous auth:', JSON.stringify(prev));
                console.log('New accessToken:', response.data.accessToken);
                const newAuth = {
                    ...prev,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken
                };
                console.log('New auth state:', newAuth); // Debug log
                return newAuth;
            });
            return response.data.accessToken;
        } catch (err) {
            console.error('Refresh token error:', err.response?.data || err.message);
            throw err; // Re-throw to handle in PersistLogin
        }
    }
    return refresh;
};

export default useRefreshToken;