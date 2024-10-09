import { withRouter } from '../core/withRouter'
import parse from 'html-react-parser'
import React from 'react'
import PropTypes from 'prop-types'
import {gql} from '@apollo/client'
import { Query } from '@apollo/client/react/components'
class ProductScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainImage: undefined,
            attributes: {}
        }
    }

    GET_PRODUCT = gql`query($id: ID!) {
        product(id: $id) {
            id 
            name 
            description 
            instock
            category 
            brand
            prices{
                amount
                currency{
                    label
                    symbol
                }
            }
            attributes{
                name
                id
                type
                items{
                    displayValue
                    value
                    id
                }
            }
            gallery
        }
    }`
    generateAttributes = (product) => {
        return product.attributes.map(attribute => <div 
            key={attribute.name} className="attribute-container hover:cursor-default" data-testid={`product-attribute-${this.toKebabCase(attribute.name)}`}    >
            <h1 className="attribute-name">{attribute.name}</h1>
            <div className="flex flex-row">
            {this.generateAttributeItems(attribute)} 
            </div>
            </div>);
    }
    generateAttributeItems = (attribute) => {
        // Set the default active item to the first in every attribute
        let result = [];
        attribute.items.forEach(attributeItem => {
            const stateAttribute = this.state.attributes[attribute.id];
            const isActive = (stateAttribute !== null) && (stateAttribute === attributeItem.value);
            const isColor = attribute.name === "Color" || attributeItem.value[0] === '#';

            result.push(
                <div key={attributeItem.id} className='flex'>

                <div className={(isColor && isActive) && 'border-solid rounded-sm absolute  w-[3.5rem] h-[3.5rem]   border-green-400 mx-2 '}></div>
                
                <div style={{backgroundColor: (isColor) && attributeItem.value}} 
                className={`
                    ${(isColor) && 'w-[2.25rem] h-[2.25rem] border-none'}  
                    border-[2px] mx-2 font-roboto transition-all font-bold rounded-sm border-solid border-gray-700  p-2 
                    ${(isActive) && 'bg-black text-white'}`} 
                onClick={ () => {this.setSelectedAttribute(attribute, attributeItem)} }  
                > {(!isColor) && attributeItem.value} </div>   

                </div> );

        })

        return result;
    }; 
    setSelectedAttribute = (attribute, selectedItem) => {
        if (this.state?.attributes?.[attribute.id] === selectedItem.value) {

            this.setState(prevState => {
                return {...prevState, attributes: {
                    ...prevState.attributes,
                    [attribute.id]: "",
                }

                };
            });



            // De-select
        } else
            this.setState(prevState => {
                return {...prevState, attributes: {
                    ...prevState.attributes,
                    [attribute.id]: selectedItem.value,
                }

                };
            });
    };

    toKebabCase = (string) => {
        return string.toLowerCase().replaceAll(" ", "-");
    }
    getImageList = (product) => {
        return product.gallery.map(pic => <img onMouseOver={() => {this.changeFocusedImage(pic)}} src={pic} className="mini-image"  />);
    }
    changeFocusedImage = (hoveredImage) => {
        this.setState(prevState => {
            return ({...prevState, focusedImage: hoveredImage})
        });
    } 
    getPrice = (product) => {
        // This fancy part of code is written by mister gippity; i look up to one-day safely checking each property i use in javascript too.
            if (product?.prices?.length > 0) {
                const { amount, currency } = product.prices[0];
                return <span className='font-raleway font-bold mb-5'>{`${currency.symbol} ${amount}`}</span>;
            }

        return <span>Price unavailable</span>;
    }
    render() {
        return (
            <Query query={this.GET_PRODUCT} variables={{id: this.props.router.params.id}}>
            { ({loading, error, data}) => {

                if (loading) {
                    return <p>Loading...</p>
                }

                if (error) {
                    return <h1>Error {error.message}</h1>
                }


                if (data) {
                    const product = data.product;
                    const attributes = this.generateAttributes(product);
                    return <div className={"productscreen-container"}> 
                        <div className='images-container'  data-testid='product-gallery'   >
                        <div className='mini-images-container'>
                        {this.getImageList(product)}
                        </div>
                        <div className={"main-image-container"}>

                        {(this.state.focusedImage != null) ? <img className='main-image' src={this.state.focusedImage} /> : <img className="main-image" src={data.product.gallery[0]} />} 
                        </div> 
                        </div>
                        <div className="information-container">
                        <h1 className="product-name">{product.name}</h1>
                        {attributes}

                        <h1 className='font-roboto font-bold font-normal mb-2'>PRICE:</h1>
                        {this.getPrice(product)}

                        <button onClick={() => {this.props.cartRef.current.addProduct({...product, attributes: product.attributes, selectedAttributes: this.state.attributes})}
                        }   data-testid='add-to-cart'  className='p-4 bg-green-400 border border-transparent text-white font-bold'>ADD TO CART</button>

                        {parse(product.description.replace("<p>", "<p className=' font-roboto text-scandiweb-black '>"))}
                        </div>
                        </div>
                }
            }}
            </Query>
        );
    }
}



ProductScreen.propTypes = {
    id: PropTypes.number
}

const productScreenWithRouter = withRouter(ProductScreen) 

export default productScreenWithRouter 
