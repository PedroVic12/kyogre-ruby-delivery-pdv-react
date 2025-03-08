// api.js
const fetch = require('node-fetch');

// Function to create a new order
const createOrder = async (order) => {
    const response = await fetch("http://localhost:1998/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        throw new Error("Failed to create order");
    }

    const data = await response.json();
    return data;
};

// Function to get all orders
const getOrders = async () => {
    const response = await fetch("http://localhost:1998/orders");
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    return data;
};


function run_api(){

    //createOrder()
    getOrders()
}

run_api()