import React from "react";
import logo from "../../assets/Signup-logo.jpg";
import searchIcon from "../../assets/search-icon.jpeg";
import cartIcon from "../../assets/cart.png";
import profileIcon from "../../assets/user.png";
import './Header.css';


function Header() {
    return (
        <div className="header">
            <img id="logo" src={logo} alt="logo" />
            <div className="shop-name">
                <h1>GoShop</h1>
                <p>Affordable Online Shopping</p>
            </div>
            <div className="search-bar">
                <input type="search" name="search-item" id="search-item" placeholder="I am looking for..."/>
                <img id="search-icon" src={searchIcon} alt="search-icon" />
            </div>
            <div className="cart-profile">
                <div className="cart">
                    <img src={cartIcon} alt="cart-logo" />                    
                </div>
                <div className="profile">
                    <img src={profileIcon} alt="profile-icon" />
                </div>
            </div>                    
        </div>
    )
}

export default Header;