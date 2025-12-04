import { useRef, useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import useToggle from '../../../hooks/useToggle';
import axios from '../../../api/axios';
import CommonAuthLayout from "./CommonAuthLayout.jsx";

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// third-party
import { useForm } from 'react-hook-form';

// validations (optional)
import { emailSchema, passwordSchema } from "../../../utils/validationSchema.js";

const LOGIN_URL = '/auth';

export default function Login() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const errRef = useRef();

    const [check, toggleCheck] = useToggle('persist', false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // react-hook-form
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        setFocus("username");
    }, [setFocus]);

    useEffect(() => {
        setErrMsg('');
    }, [errors]);

    const onSubmit = async (data) => {
        const { username, password } = data;

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user: username, pwd: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({ user: username, pwd: password, roles, accessToken });

            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <CommonAuthLayout
            title="Sign in"
            subHeading="To keep connected with us."
            footerLink={{ title: 'Create a new account', link: '/register' }}
        >
            <div>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack sx={{ gap: 3 }}>

                        {/* USERNAME */}
                        <Box>
                            <TextField
                                label="Username"
                                fullWidth
                                variant="outlined"
                                {...register('username')}
                                error={Boolean(errors.username)}
                                placeholder="Enter your username"
                            />
                            {errors.username?.message && (
                                <FormHelperText error>{errors.username.message}</FormHelperText>
                            )}
                        </Box>

                        {/* PASSWORD */}
                        <Box>
                            <FormControl fullWidth error={Boolean(errors.password)}>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    {...register('password', passwordSchema)}
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    label="Password"
                                    placeholder="Enter your password"
                                    endAdornment={
                                        <InputAdornment
                                            position="end"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        >
                                            {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            {/* PASSWORD ERROR + FORGOT LINK */}
                            <Stack
                                direction="row"
                                sx={{
                                    alignItems: 'flex-start',
                                    justifyContent: errors.password ? 'space-between' : 'flex-end',
                                    width: 1,
                                    gap: 1
                                }}
                            >
                                {errors.password?.message && (
                                    <FormHelperText error>{errors.password.message}</FormHelperText>
                                )}

                                <Link
                                    component={RouterLink}
                                    underline="hover"
                                    variant="subtitle2"
                                    to="/forgot-password"
                                    sx={{
                                        '&:hover': { color: 'primary.dark' },
                                        mt: 0.375,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* TRUST THIS DEVICE */}
                    <div className="persistCheck" style={{ marginTop: 20 }}>
                        <input
                            type="checkbox"
                            id="persist"
                            onChange={toggleCheck}
                            checked={check}
                        />
                        <label htmlFor="persist">Trust This Device</label>
                    </div>

                    {/* LOGIN BUTTON */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ minWidth: 120, mt: 3 }}
                    >
                        Sign In
                    </Button>
                </form>

                <p style={{ marginTop: 20 }}>
                    Need an Account?{' '}
                    <span className="line">
            <RouterLink to="/register">Sign Up</RouterLink>
          </span>
                </p>
            </div>
        </CommonAuthLayout>
    );
}
