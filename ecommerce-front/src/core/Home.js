import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";


const Home = () => {
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);


    const loadProductsByArrival = () => {
        getProducts("createdAt").then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProductsByArrival(data);
            }
        });
    };

    useEffect(() => {
        loadProductsByArrival();
    }, []);

    return (
        <Layout
            title="Give the Gift of Adventure "
            description="We've got 1000s of experiences waiting to be discovered!"
            className="container-fluid"
            
        >
            <Search />

            <h2 className="mb-1">Gifts-piration</h2>
            <p class="text-gray-soft">Give your loved ones the gift of amazing memories</p>
            <div className="row">
                {productsByArrival.map((product, i) => (
                    <div key={i} className="col-2">
                        <Card product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;
