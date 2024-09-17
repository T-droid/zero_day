import React from "react";
import Footer from "../components/Common/Footer";
import Header from "../components/Common/Header";
import Cartegories from "../components/Common/Cartegories";
import About from "../components/Common/About";
import ProductCard from "../components/Common/ProductCard";
import "./HomePage.css";

function Home() {

    const products = [
        { id: 1, name: 'Product 1', price: 29.99, image: '/images/product1.jpg' },
        { id: 2, name: 'Product 2', price: 49.99, image: '/images/product2.jpg' },
    ];
    
    const handleAddToCart = (product) => {
        console.log(`${product.name} added to cart`);  
    };

    return (
        <div className="homepage">
            <section>
                <Header />
            </section>
            <Cartegories />
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
            <About />
            <section>
                <Footer />
            </section>
        </div>
    )
}

export default Home;