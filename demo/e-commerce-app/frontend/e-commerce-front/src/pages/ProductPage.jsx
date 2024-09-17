import React from "react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import './ProductPage.css'


function Product(){
    return (
        <div>
            <Header />
            <div className="product-card">
                <img src="#" alt="product image" />
                <div className="product-details">
                    <h2>Garnier Pure Active 3 In1 Charcoal Anti Blackhead Mask Wash Scrub 150ml</h2>
                    <p className="price">Ksh 859</p>
                    <div>
                        <div className="services">
                            <p>Services:</p>
                            <p>Fulfilled by Kilimall</p>
                        </div>
                        <div className="color">
                            <p>Color:</p>
                            <div>
                                <img src="#" alt="product icon"/>
                                Black
                            </div>                        
                        </div>
                        <div className="size">
                            <p>Size:</p>
                            <div>normal</div>
                        </div>
                        <div className="quantity">
                            <p>Quantity</p>
                            <div className="amount">
                                <button>-</button>
                                <p>1</p>
                                <button>+</button>
                            </div>
                        </div>
                        <div>
                            <button>Add to Cart</button>
                            <button>Buy Now</button>
                            <button>Like</button>
                            <button>SHare</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="reviews">
                <p>Reviews</p>
                <div className="review-card">
                    <h2>My Name</h2>
                    <p>My review</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Product;