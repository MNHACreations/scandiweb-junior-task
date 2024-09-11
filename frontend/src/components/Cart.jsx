import React from 'react'

class Cart extends React.Component {
    constructor() {
        super();
    }


    addProduct = (product) => {
        console.log("Adding product to the cart! (This is coming)");
        console.log(product);
    };


    render() {
        return (
            <div id="cart-container">
            
            </div>
        );
    }

}

export default Cart
