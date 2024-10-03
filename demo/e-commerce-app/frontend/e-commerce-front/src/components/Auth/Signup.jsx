import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Signuplogo from '../../assets/Signup-logo.jpg';
import { setUser } from '../../Redux/slices/userSlice';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        if (!agree) {
            alert("Please agree to the Terms & Conditions");
            return;
        }
        try {
            const response = await axios.post('http://localhost/3000/api/register', { email, password });
            const { accessToken, name } = response.data;
            dispatch(setUser({ accessToken, name, email }));
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-logo">
                    <h2>Welcome to GoShop</h2>
                    <img src={Signuplogo} alt="logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="signup-input-container">
                        <label htmlFor="email">email</label>
                        <br />
                        <input type="email" name="email" id="email" placeholder="Please input email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="signup-input-container">
                        <label htmlFor="password">password</label>
                        <br />
                        <input type="password" name="password" id="password" placeholder="Please input password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="signup-input-container">
                        <label htmlFor="confirmPassword">confirm password</label>
                        <br />
                        <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Please confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div className="terms-and-conditions">
                        <input type="checkbox" name="agree" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                        <p>I agree to GoShop <a href="#">Terms & Conditions and Privacy Policy</a></p>
                    </div>
                    <button id="signup" type="submit">Signup</button>
                </form>
                <div className="redirect-to-login">
                    <p>Have an account? <a href="/login">login</a></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;