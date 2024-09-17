import React from "react";
import './Signup.css';
import Signuplogo from '../../assets/Signup-logo.jpg'

function Login() {
    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-logo">
                    <h2>Welcome Back to GoShop</h2>
                    <img src={Signuplogo} alt="logo" />
                </div>
                <form action="/login" method="post">
                    <div className="signup-input-container">
                        <label htmlFor="email">email</label>
                        <br />
                        <input type="email" name="email" id="email" placeholder="Please input email"/>                    
                    </div>
                    <div className="signup-input-container">
                        <label htmlFor="password">password</label>
                        <br />
                        <input type="password" name="password" id="password" placeholder="Please input password"/>
                    </div>                    
                    <div className="terms-and-conditions">
                        <input type="checkbox" name="agree" id="agree"  checked/>
                        <p>I agree to GoShop <a href="#">Terms & Conditions and Privacy Policy</a></p>
                    </div>
                    <button id="signup" type="submit">Login</button>
                </form>
                <div className="redirect-to-login">
                    <p>Don't have an account? <a href="/register">Signup</a></p>
                </div>               
            </div>
        </div>
    )
}

export default Login;