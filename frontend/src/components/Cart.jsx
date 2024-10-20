import React from 'react';
import { ApolloConsumer } from "@apollo/client";
import cartLogo from '../../assets/cart.svg';
import { gql } from '@apollo/client';
import { Mutation, Query } from '@apollo/client/react/components';
const INSERT_ORDER = gql`
mutation InsertOrder(
    $product_id: ID!,
    $name: String!,
    $attributes: String!,
    $quantity: Int!,
    $total_price: Float!,
    $date: String!
) {
    InsertOrder(
        product_id: $product_id,
        name: $name,
        attributes: $attributes,
        quantity: $quantity,
        total_price: $total_price,
        date: $date
    )
}
`;
class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartSize: 0,
            cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
            cartMenuState: false,
            checkOutText: "Place order"
        };
    }

    componentDidMount() {
        this.props.setIsCartReady(true);
    }

    getCartItems = () => Object.values(this.state.cartItems);

    placeOrder = (client) => {
        if (this.getCartSize() > 0) {

            const promises = this.getCartItems().map(cartItem => {
                return client.mutate({
                    mutation: INSERT_ORDER,
                    variables: {
                        product_id: cartItem.id,
                        name: cartItem.name,
                        attributes: JSON.stringify(cartItem.selectedAttributes),
                        quantity: cartItem.amount,
                        total_price: cartItem.prices[0].amount * cartItem.amount,
                        date: new Date().toISOString(),
                    }
                });
            });

            Promise.all(promises)
                .then(() => {
                    this.setState( prevState => { return{...prevState, cartItems: [], checkOutText: "Order placed!" }});
                    console.log('Order placed');
                })
                .catch(error => {
                    this.setState({ checkOutText: "Couldn't place your order." });
                    console.error('Error placing order', error);
                });
        }
    };

    getCartSize = () => {
        return this.state.cartItems.reduce((total, cartItem) => total + cartItem.amount, 0);
    };

    getCartElement = () => (
        <div>
        <img src={cartLogo} id="cart-logo" alt="Cart" />
        </div>
    );

    toggleCart = () => {
        this.setState(prevState => ({
            cartMenuState: !prevState.cartMenuState
        }));
    };

    addProduct = (product) => {
        this.setState(prevState => {
            const existingProductIndex = prevState.cartItems.findIndex(
                cartItem => cartItem.id === product.id &&
                JSON.stringify(cartItem.selectedAttributes) === JSON.stringify(product.selectedAttributes)
            );

            if (existingProductIndex >= 0) {
                const updatedProduct = {
                    ...prevState.cartItems[existingProductIndex],
                    amount: prevState.cartItems[existingProductIndex].amount + 1
                };
                const updatedCartItems = [...prevState.cartItems];
                updatedCartItems[existingProductIndex] = updatedProduct;
                return { cartItems: updatedCartItems };
            } else {
                const productWithAmount = { ...product, amount: 1 };
                return { cartItems: [...prevState.cartItems, productWithAmount] };
            }
        });

        this.toggleCart();
    };

    changeAmount = (product, amount) => {
        this.setState(prevState => {
            const updatedCartItems = [...prevState.cartItems];
            const productIndex = updatedCartItems.indexOf(product);
            const newAmount = product.amount + amount;

            if (newAmount > 0) {
                updatedCartItems[productIndex] = { ...product, amount: newAmount };
                return { cartItems: updatedCartItems };
            } else {
                updatedCartItems.splice(productIndex, 1);
                return { cartItems: updatedCartItems }
            }
        });
    };

    generateAttributes = (product) => {
        return product.attributes.map(attribute => (
            <div key={attribute.name} data-testid={`cart-item-attribute-${this.toKebabCase(attribute.name)}`} className="hover:cursor-default">
            <h1 className="attribute-name">{attribute.name}</h1>
            <div className="flex flex-row">
            {this.generateAttributeItems(attribute, product.selectedAttributes)}
            </div>
            </div>
        ));
    };
    toKebabCase = (string) => {
        return string.toLowerCase().replaceAll(" ", "-");
    }
    generateAttributeItems = (attribute, selectedAttributes) => {
        return attribute.items.map(attributeItem => {
            const isActive = selectedAttributes[attribute.name] === attributeItem.value;
            return (
                <div
                key={attributeItem.id}
                className={`${
                    isActive && attributeItem.value[0] === '#' ? 'border-solid border-green-500' : ''
                } box-border mr-1 my-1.5 p-0.5`}
                data-testid={this.toKebabCase(`cart-item-attribute-${attribute.name}-${attributeItem.value}${(isActive) ? '-selected' : ''}`)}  >
                <div
                style={{ backgroundColor: attributeItem.value[0] === '#' && attributeItem.value }}
                className={`border-solid border-gray-700 pr-2 pl-2 p-1 ${
                    isActive ? 'bg-black text-white' : ''
                }`}
                >
                {attributeItem.value[0] !== '#' && attributeItem.value}
                </div>
                </div>
            );
        });
    };

    componentDidUpdate()  {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
        console.log("SAVING")
    };
    getTotalPrice = () => {
        // TODO: Handle this in a better way
        let lastDetectedCurrencySymbol = "$"; // Defaulting to dollars
        let price = 0;
        this.state.cartItems.forEach(cartItem => {
            const cartItemPrice = cartItem.prices[0].amount * cartItem.amount;
            price+=cartItemPrice;
            lastDetectedCurrencySymbol = cartItem.prices[0].currency.symbol;
        })

        return lastDetectedCurrencySymbol +  Math.round(price);
    }
    render() {
        const { cartMenuState } = this.state;
        return (
            cartMenuState ? (
                <ApolloConsumer>
                {(client) => (
                    <div
                    onClick={() => this.setState({ cartMenuState: false })}
                    className="transition-all fixed top-[4.6rem] left-0 w-full h-screen z-10"
                    style={{ backgroundColor: '#00000080' }}
                    >
                    <div
                    className="w-80 bg-white absolute top-0 right-2 z-20 font-sans border-4 border-gray-600 text-xs p-5"
                    onClick={(event) => event.stopPropagation()}
                    >
                    <div className="flex text-xs font-sans">
                    <h1>My bag,</h1>
                    <p data-testid='cart-item-amount' className="flex items-center font-bold ml-2">
                    {this.getCartSize()} items
                    </p>
                    </div>
                    {this.getCartItems().map(cartItem => (
                        <div key={cartItem.id} className="z-50 transition-all flex font-sans">
                        <div className="flex flex-col text-xs max-w-40">
                        <h1 className="text-base font-raleway mr-2">{cartItem.name}</h1>
                        <p className="font-bold font-mono text-base">
                        {cartItem.prices[0].currency.symbol}{cartItem.prices[0].amount}
                        </p>
                        <div className="flex flex-col mt-2">
                        {this.generateAttributes(cartItem)}
                        </div>
                        </div>
                        <div className="flex flex-col h-36">
                        <button
                        onClick={() => this.changeAmount(cartItem, 1)}
                        className="transition-all z-50 border-solid p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white"
                        data-testid='cart-item-amount-increase'>
                        +
                        </button>
                        <span className="mt-7 mb-7 text-center">{cartItem.amount}</span>
                        <button
                        onClick={() => this.changeAmount(cartItem, -1)}
                        className="transition-all z-50 border-solid p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white"
                        data-testid='cart-item-amount-decrease'>
                        -
                        </button>
                        </div>
                        <img className="max-w-32 max-h-40" src={cartItem.gallery[0]} alt={cartItem.name} />
                        </div>
                    ))}
                    <div className='flex flex-row justify-between'>
                    <h2 className='font-sans'>Total: </h2>
                    <span className='self-center font-raleway font-bold text-center' data-testid='cart-total'>
                    {this.getTotalPrice()}
                    </span>
                    </div>
                    <button
                    onClick={() => this.placeOrder(client)}  // Passing client here
                    className={`w-80 h-10 ${(this.getCartSize() > 0) ? `bg-green-400  hover:bg-green-500 active:bg-green-600 ` : `bg-gray-500`} text-white font-bold transition-all font-raleway border-transparent`}
                    >
                    {this.state.checkOutText}
                    </button>
                    </div>
                    </div>
                )}
                </ApolloConsumer>
            ) : null
        );
    }
}
export default Cart;

