import React from "react";
import "./Cart.css";


function Cart() {
    return (
        <>
        <div className="cart-container">
            <img src="#" alt="product image" />
            <div className="product-description">
                <p>Product description</p>
                <p>Product name</p>
            </div>
            <div className="price-quantity">
                <div className="quantity">
                    <button>-</button>
                    <p>1</p>
                    <button>+</button>
                </div>
                <p id="amount">ksh 516</p>
                <button id="delete-item">Delete</button>
            </div>
        </div>
        <div className="total">
            <div className="formality">
                <p>7 Days Money Back Guarrantee</p>
                <p className="gray">continue shopping</p>
            </div>
            <div className="total-amount">
                <div className="price">
                    <p className="gray">Total</p>
                    <p>KSh 1500</p>
                </div>
                <button id="checkout-btn">Proceed to checkout</button>
            </div>
        </div>
        </>
    )
}

export default Cart;