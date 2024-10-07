import React from 'react';
import cartLogo from '../../assets/cart.svg';

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartSize: 0,
            cartItems: [],
            cartMenuState: false,
        };
    }

    componentDidMount() {
        this.props.setIsCartReady(true);
    }

    getCartItems = () => Object.values(this.state.cartItems);

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
    };

    changeAmount = (product, amount) => {
        this.setState(prevState => {
            const updatedCartItems = [...prevState.cartItems];
            const productIndex = updatedCartItems.indexOf(product);
            const newAmount = product.amount + amount;

            if (newAmount >= 0) {
                updatedCartItems[productIndex] = { ...product, amount: newAmount };
                return { cartItems: updatedCartItems };
            }
        });
    };

    generateAttributes = (product) => {
        return product.attributes.map(attribute => (
            <div key={attribute.name} className="hover:cursor-default">
                <h1 className="attribute-name">{attribute.name}</h1>
                <div className="flex flex-row">
                    {this.generateAttributeItems(attribute, product.selectedAttributes)}
                </div>
            </div>
        ));
    };

    generateAttributeItems = (attribute, selectedAttributes) => {
        return attribute.items.map(attributeItem => {
            const isActive = selectedAttributes[attribute.name] === attributeItem.value;
            return (
                <div
                    key={attributeItem.id}
                    className={`${
                        isActive && attributeItem.value[0] === '#' ? 'border-solid border-green-500' : ''
                    } box-border mr-1 my-1.5 p-0.5`}
                >
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

    render() {
        const { cartMenuState } = this.state;
        return (
            cartMenuState ? (
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
                            <p className="flex items-center font-bold ml-2">
                                {this.getCartSize()} items
                            </p>
                        </div>
                        {this.getCartItems().map(cartItem => (
                            <div key={cartItem.id} className="z-50 transition-all flex font-sans">
                                <div className="flex flex-col text-xs max-w-40">
                                    <h1 className="text-base">{cartItem.name}</h1>
                                    <p className="font-bold font-mono text-base">
                                        {cartItem.prices[0].currency.symbol}{cartItem.prices[0].amount}
                                    </p>
                                    <div className="flex flex-col mt-2">
                                        {this.generateAttributes(cartItem)}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => this.changeAmount(cartItem, 1)}
                                        className="transition-all z-50 border-double p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white"
                                    >
                                        +
                                    </button>
                                    <span className="mt-2.5 mb-2.5 text-center">{cartItem.amount}</span>
                                    <button
                                        onClick={() => this.changeAmount(cartItem, -1)}
                                        className="transition-all z-50 border-double p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white"
                                    >
                                        -
                                    </button>
                                </div>
                                <img className="max-w-32 max-h-52" src={cartItem.gallery[0]} alt={cartItem.name} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null
        );
    }
}

export default Cart;

