import cartLogo from '../../assets/cart.svg'
import React from 'react'
class Cart extends React.Component {
    constructor(props) {
        super(props);
        // Initialize the state with cartSize and cartItems
        this.state = {
            cartSize: 0,
            cartItems: {},  // Using an object to store products with their id as keys
            cartMenuState: false,
        };
    }


    componentDidMount() {
        this.props.setIsCartReady(true);
    }
    getCartItems = () => {
        return Object.values(this.state.cartItems);
    };
    getCartSize = () => {
        let count = 0;
        Object.values(this.state.cartItems).forEach(cartItem => {
            // Add one for each variant
            count = Object.values(cartItem).length
        });
        return count;
    }

    getCartElement = () => {
        return <div>
            <img src={cartLogo} id="cart-logo" />
            </div>

    }

    toggleCart = () => {
        this.setState({ cartMenuState: !this.state.cartMenuState });
    };
addProduct = (product) => {
    this.setState(prevState => {
        const previousVariants = prevState.cartItems[product.id] || []; // Get existing variants or an empty array
        return {
            ...prevState,
            cartItems: {
                ...prevState.cartItems,
                [product.id]: [...previousVariants, product] // Add the new variant to the array
            }
        };
    }, () => {
        console.log("Cart item", this.state.cartItems);
    });
};

    generateAttributes = (product) => {
        console.log("CART item");
        console.log(product);
        return product.attributes.map(attribute => <div 
            key={attribute.name} className="attribute-container">
            <h1 className="attribute-name">{attribute.name}</h1>
            <ol className="attribute-items">
            {this.generateAttributeItems(attribute, product)} 
            </ol>
            </div>);
    }
    generateAttributeItems = (attribute, item) => {
        return attribute.items.map(attributeItem =>
            <div key={attribute.id} className="attribute-item-container">
            <li id={attributeItem.id} style={{backgroundColor: (attribute.id == "Color") ? attributeItem.value : "#FFFFFF"}} 

            className={(item.activeAttributes[attribute.id] != null) ?
                `attribute-item ${(item.activeAttributes[attribute.id] === attributeItem.value) ?
                        `attribute-item attribute-selected ${attribute.id}` 
                        : attribute.id}` 
                : `attribute-item ${attribute.id}`}
            onClick={() => {this.setSelectedAttribute(attribute, attributeItem)}}

            >{(attribute.id == "Color") ? "" : attributeItem.displayValue}</li> 

            </div>);
    }; 
    displayNewItem = (item, uniqueMap) => {
        uniqueMap.forEach(mapItem => {
            if (item === mapItem) return false;
        });

        return true;
    }

    getVariantIndex = (variant) => {
        const cartItemsItterable = Object.values(this.state.cartItems);
        let variantIndex = -1;
        
        cartItemsItterable.forEach(cartItem => {
            const cartItemVariants = Object.values(cartItem);

            if (cartItemVariants.includes(variant)) {
                variantIndex = cartItemVariants.indexOf(variant);
            }
        });


        return variantIndex;
    };
    isUniqueVariant = (variant) => {
        let foundDuplicate = false;

        // true == variant will be rendered
        // false == variant will NOT be rendered
        const cartItemsItterable = Object.values(this.state.cartItems);

        const variantAttributes = variant.selectedAttributes;
        const indexOfVariant = this.getVariantIndex(variant);

        cartItemsItterable.forEach(cartItem => {
            const cartItemVariants = Object.values(cartItem);
            // Doing what's down below but with a for loop
            for (let i = 0; i < cartItemVariants.length; i++) {
               const cartItemVariant = cartItemVariants[i]; 

               const cartItemVariantAttributes = cartItemVariant.selectedAttributes; 

               if (JSON.stringify(cartItemVariantAttributes) === JSON.stringify(variantAttributes)) {
                    if (indexOfVariant !== i) {
                        // Duplicate found baby!
                        // Check if this is the first one to be of that type, if so; return true
                        if (indexOfVariant > i) {
                            foundDuplicate = false
                        } else { 
                            foundDuplicate = true;
                        }
                    }          
               }

            }
           
        });

            return foundDuplicate;
    };
    
    getProductSize = (variant) => {
         let size = 1;

        // true == variant will be rendered
        // false == variant will NOT be rendered
        const cartItemsItterable = Object.values(this.state.cartItems);

        const variantAttributes = variant.selectedAttributes;
        const indexOfVariant = this.getVariantIndex(variant);

        cartItemsItterable.forEach(cartItem => {
            const cartItemVariants = Object.values(cartItem);
            // Doing what's down below but with a for loop
            for (let i = 0; i < cartItemVariants.length; i++) {
               const cartItemVariant = cartItemVariants[i]; 

               const cartItemVariantAttributes = cartItemVariant.selectedAttributes; 

               if (JSON.stringify(cartItemVariantAttributes) === JSON.stringify(variantAttributes)) {
                    if (indexOfVariant !== i) {
                        // Duplicate found baby!
                        // Check if this is the first one to be of that type, if so; return true
                        size++;
                    }          
               }

            }
           
        });

            return size;

    }
    render() {
        let registeredItemAttr = {}; // id : [ {attr1: "test"}, {attr2: "test"}  ]

        // if registeredItemAttr includes item id: loop over the registered rendered attrs, if one is equavilent of current, don't render
       let uniqueProductsMap = [];

        const variantsToRender = [];
        this.getCartItems().forEach(cartItem => {
            const cartVariants = Object.values(cartItem);
            cartVariants.forEach(cartItemVariant => {
                
            if (!this.isUniqueVariant(cartItemVariant)) {
                variantsToRender.push(cartItemVariant);
            }
            });

        });        

        return (
            (this.state.cartMenuState) ?

            <div className='w-80  bg-white
            absolute top-20 right-2 z-50 font-sans border-4 border-gray-600 text-xs mr-5'>
            <div className='flex text-xs font-sans'>
            <h1>My bag,</h1>
            <p className='flex items-center font-bold ml-2'>{this.getCartSize()} items</p>
            </div>


            

            {variantsToRender.map(cartItem =>
                
                (this.displayNewItem(cartItem, uniqueProductsMap))
                    &&   <div className=' z-50 transition-all flex font-sans'>
                {console.log("Just rendered a product with the following attributes: ")} {console.log(cartItem.selectedAttributes)}
                <div className='flex flex-col text-xs max-w-40'>
                <h1 className='text-base'>{cartItem.name}</h1>
                <p className="font-bold font-mono text-base">{cartItem.prices[0].currency.symbol}{cartItem.prices[0].amount}</p>

                <div className='flex flex-col'>

                {
                    cartItem.attributes
                }                 </div>

                </div>

                <div className='flex flex-col'>
                <button className='transition-all border-double p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white '>+</button>
                <span className='mt-2.5 text-center'>{this.getProductSize(cartItem)}</span>
                <button className='transition-all border-double p-2 pr-3 pl-3 bg-transparent hover:bg-black hover:text-white mt-2.5 '>-</button>
                </div>
                <img className='w-1/3 h-1/3' src={cartItem.gallery[0]} />

                </div>

            )}

                 <div className='transition-all  fixed top-[4.6rem] left-0 w-full h-screen z-0' onClick={() => {this.toggleCart()}} style={{backgroundColor: '#00000080'}}> </div>

            </div> : <></>
        );
    }
}

export default Cart;

