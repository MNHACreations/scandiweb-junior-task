import { withRouter } from '../core/withRouter'
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
    generateAttributes = (product, interactive) => {
        return product.attributes.map(attribute => <div 
            key={attribute.name} className="attribute-container hover:cursor-default">
                <h1 className="attribute-name">{attribute.name}</h1>
                <div className="flex flex-row">
            {this.generateAttributeItems(attribute, interactive)} 
                </div>
            </div>);
    }
generateAttributeItems = (attribute, interactive) => {
    // Set the default active item to the first in every attribute
    let result = [];
    attribute.items.forEach(attributeItem => {
        const stateAttribute = this.state.attributes[attribute.id];
       const isActive = (stateAttribute !== null) && (stateAttribute === attributeItem.value);


result.push(<div 
        key={attributeItem.id}
        className={`${
    (isActive && attributeItem.value[0] == '#') &&
    'border-solid border-green-500'}  box-border  mx-3 my-2 p-0.5`}>
        <div
        style={{backgroundColor: (attributeItem.value[0] === '#') && attributeItem.value}} 
        className={`border-solid border-gray-700  p-2 
            ${(isActive) && 'bg-black text-white'}`} 
        onClick={ () => {interactive && this.setSelectedAttribute(attribute, attributeItem)} }  
        > {(attributeItem.value[0] != '#') && attributeItem.value} </div>   
    
       </div> );
        
    })

    return result;
}; 
    setSelectedAttribute = (attribute, selectedItem) => {
        this.setState(prevState => {
            return {...prevState, attributes: {
                ...prevState.attributes,
                [attribute.id]: selectedItem.value,
            }

            };
        });
    };

    getImageList = (product) => {
        return product.gallery.map(pic => <img onMouseOver={() => {this.changeFocusedImage(pic)}} src={pic} className="mini-image"  />);
    }
    changeFocusedImage = (hoveredImage) => {
        this.setState(prevState => {
            return ({...prevState, focusedImage: hoveredImage})
        });
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
                    const attributes = this.generateAttributes(product, true);
                    const cartAttributes = this.generateAttributes(product, false);
                    return <div className={"productscreen-container"}> 
                        <div className='images-container'>
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
                            <button onClick={() => {this.props.cartRef.current.addProduct({...product, attributes: product.attributes, selectedAttributes: this.state.attributes})}
                            } className='product-buy-button'>Buy</button>
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
