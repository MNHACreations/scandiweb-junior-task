import React from "react";
import cartLogo from '../../assets/cart.svg'
import PropTypes from 'prop-types'
import Cart from './Cart'
import { Link } from "react-router-dom";
// TODO: Add data fields && classes/ids
export default class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.productJson.id,
            product_id: props.productJson.product_id,
            name: props.productJson.name,
            instock: props.productJson.instock,
            gallery: props.productJson.gallery,
            description: props.productJson.description,
            category: props.productJson.category,
            attributes: props.productJson.attributes,
            prices: props.productJson.prices,
            price: props.productJson.prices[0],  
            brand: props.productJson.brand,
            currency: props.productJson.prices[0].currency,
            selectedAttributes: this.getDefault(props.productJson.attributes),
        };
    }

    getDefault = (attrs) => {
        const defaultSelectedAttributes = {};
        const currentAvailableAttributes = Object.values(attrs);


        currentAvailableAttributes.forEach(attributeSet => {
            const firstAttributeItem = attributeSet.items[0];
            defaultSelectedAttributes[attributeSet.id] =  firstAttributeItem.value;

        })


        return defaultSelectedAttributes;
    }

    toKebabCase = (string) => {
        return string.toLowerCase().replaceAll(" ", "-");
    }
    render() {
        return <div   data-testid={`product-${this.toKebabCase(this.state.name)}`} onClick={this.productRoute} 
        className="  pb-[5px] items-center self-center justify-center  transition-all duration-[350ms] ease-in
            hover:transition-all hover:drop-shadow-xl group 
            w-[18rem] h-[23rem] flex flex-col hover:bg-white hover:shadow-white">
            <Link to={`/product/${this.state.id}`} className="product-link">
            <img className="w-64 max-h-64 rounded-2xl" src={this.state.gallery[0]}></img>
            <div className="product-meta">
            <p className="product-name font-roboto font-normal">{this.state.name}</p>
            <p className="product-price font-raleway font-extrabold">{this.state.currency.symbol}{this.state.price.amount}</p>

            </div>
            </Link>


            <button className="flex hidden transition-all active:bg-green-600  border-transparent absolute bottom-16 right-5 hover:bg-green-500  rounded-full w-14 h-14 bg-green-400  justify-center items-center group-hover:flex" onClick={() => {this.props.onProductAdd(this.state)}}>
            <img className="w-10 h-10 filter: invert" src={cartLogo} />
            </button>
            </div>;
    }
}

Product.propTypes = {
    id: PropTypes.number,
    product_id: PropTypes.string,
    product_type: PropTypes.string,
    name: PropTypes.string,
    instock: PropTypes.bool,
    gallery: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    category: PropTypes.string,
    attributes: PropTypes.arrayOf(PropTypes.string),
    prices: PropTypes.arrayOf(PropTypes.string),
    brand: PropTypes.string,
    productJson: PropTypes.object,
    onProductAdd: PropTypes.func
};
