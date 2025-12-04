import { useRef, useState, useEffect } from "react";
import axios from '../../../api/axios';
import { Link } from "react-router-dom";

import CommonAuthLayout from "./CommonAuthLayout.jsx";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from "react-hook-form";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function Register() {
    const userRef = useRef();
    const errRef = useRef();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // react-hook-form
    const {
        register,
        handleSubmit,
        watch,
        setFocus,
        formState: { errors }
    } = useForm();

    const pwd = watch("password");
    const matchPwd = watch("confirm_password");

    useEffect(() => {
        setFocus("username");
    }, [setFocus]);

    useEffect(() => {
        setErrMsg("");
    }, [pwd, matchPwd]);

    const onSubmit = async (data) => {
        const { username, password } = data;

        // Validate final check
        if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ user: username, pwd: password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            console.log("Registration success:", response.data);

            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
        }
    };

    return (
        <CommonAuthLayout title="Register" subHeading="To keep connected with us." footerLink={{ title: 'Having an account', link: '/login' }}>

        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p
                        ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>

                    <h1>Register</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            {/* Username */}
                            <Box>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    variant="outlined"
                                    {...register("username", {
                                        required: "Username is required",
                                        validate: (v) =>
                                            USER_REGEX.test(v) ||
                                            "4–24 chars, start with letter, letters/numbers/_/- only"
                                    })}
                                    error={Boolean(errors.username)}
                                />
                                {errors.username && (
                                    <FormHelperText error>
                                        {errors.username.message}
                                    </FormHelperText>
                                )}
                            </Box>

                            {/* Password */}
                            <Box>
                                <FormControl fullWidth error={Boolean(errors.password)}>
                                    <InputLabel>Password</InputLabel>
                                    <OutlinedInput
                                        type={isPasswordVisible ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password required",
                                            validate: (v) =>
                                                PWD_REGEX.test(v) ||
                                                "8–24 chars, uppercase, lowercase, number, special(!@#$%)"
                                        })}
                                        endAdornment={
                                            <InputAdornment
                                                position="end"
                                                sx={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    setIsPasswordVisible(!isPasswordVisible)
                                                }
                                            >
                                                {isPasswordVisible ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                                {errors.password && (
                                    <FormHelperText error>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                            </Box>

                            {/* Confirm Password */}
                            <Box>
                                <FormControl
                                    fullWidth
                                    error={Boolean(errors.confirm_password)}
                                >
                                    <InputLabel>Confirm Password</InputLabel>
                                    <OutlinedInput
                                        type={isPasswordVisible ? "text" : "password"}
                                        {...register("confirm_password", {
                                            required: "Confirm password",
                                            validate: (v) =>
                                                v === pwd || "Passwords do not match"
                                        })}
                                        label="Confirm Password"
                                    />
                                </FormControl>
                                {errors.confirm_password && (
                                    <FormHelperText error>
                                        {errors.confirm_password.message}
                                    </FormHelperText>
                                )}
                            </Box>

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={Boolean(errors.username || errors.password || errors.confirm_password)}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </form>

                    <p style={{ marginTop: 20 }}>
                        Already registered?
                        <br />
                        <span className="line">
                            <Link to="/login">Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
        </CommonAuthLayout>
    );
}
