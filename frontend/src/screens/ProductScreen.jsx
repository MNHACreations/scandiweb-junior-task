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
            mainImage: 0,
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
            const color = attributeItem.value;
            result.push(
                <div key={attributeItem.id} className='flex'>


                
                
                <div style={{backgroundColor: (isColor) && attributeItem.value}}
                className={`
                    ${(isColor) && `w-[2.25rem] h-[2.25rem] ${(isActive) ? `border-solid border-emerald-400 border-s-8 ` : 'border-solid border-black'}`}  
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
        let result = [];
        for (let i = 0; i < product.gallery.length; i++) {
           const pic = product.gallery[i];
            result.push(<img onMouseOver={() => {this.changeFocusedImage(i)}} src={pic} className='mini-image' />)
        }
        return result;
    }
    changeFocusedImage = (hoveredImageIndex) => {
        this.setState(prevState => {
            return ({...prevState, mainImage: hoveredImageIndex})
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
                        <div className={"main-image-container flex flex-row"}>

                        <button className='h-10 w-10 relative left-10 top-56 bg-[rgba(0,0,0,0.5)] border-transparent text-white font-extrabold'
                    onClick={() => {this.changeFocusedImage(((this.state.mainImage - 1) !== -1) ? this.state.mainImage - 1 : this.state.mainImage)}}
                        >⇦</button>
                        
                             <img className='main-image' src={product.gallery[this.state.mainImage]} />
                            
                            
                         
                        <button className='h-10 w-10 relative right-10 top-56 bg-[rgba(0,0,0,0.5)] border-transparent text-white font-extrabold'
                        onClick={() => {this.changeFocusedImage(((this.state.mainImage + 1) !== product.gallery.length) ? this.state.mainImage + 1 : this.state.mainImage)} }
                        >⇨</button>
                        </div> 
                        </div>
                        <div className="flex flex-col mt-40 mr-52">
                        <h1 className="product-name">{product.name}</h1>
                        {attributes}

                        <h1 className='font-roboto font-bold font-normal mb-2'>PRICE:</h1>
                        {this.getPrice(product)}

                        <button onClick={() => {this.props.cartRef.current.addProduct({...product, attributes: product.attributes, selectedAttributes: this.state.attributes})}
                        }   data-testid='add-to-cart'  className='p-4 bg-green-400 border border-transparent text-white font-bold transition-all w-96 hover:bg-green-500 active:bg-green-600'>ADD TO CART</button>

                        {parse(product.description.replace("<p>", "<p data-testid='product-description'   className=' font-roboto text-scandiweb-black '>"))}
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
