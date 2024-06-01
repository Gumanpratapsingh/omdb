import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
                username: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate('/home');
        } catch (error) {
            console.error('Sign in failed:', error);
            setErrorMessage('Invalid email or password. Please enter the correct credentials.');
        }
    };

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"} />
                <SubHeading label={"Enter your credentials to access your account"} />
                <InputBox value={email} onChange={(e) => setEmail(e.target.value)} placeholder="fasal_IoT@gmail.com" label={"Email"} />
                <InputBox value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6119112" label={"Password"} />
                {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}
                <div className="pt-4">
                    <Button onClick={handleSignIn} label={"Sign in"} />
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </div>
        </div>
    </div>;
};
