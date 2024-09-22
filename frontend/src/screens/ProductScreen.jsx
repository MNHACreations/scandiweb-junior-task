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
    generateAttributes = (product) => {
        return product.attributes.map(attribute => <div 
            key={attribute.name} className="attribute-container">
                <h1 className="attribute-name">{attribute.name}</h1>
                <ol className="attribute-items">
            {this.generateAttributeItems(attribute)} 
                </ol>
            </div>);
    }
    setSelectedAttribute = (attribute, selectedItem) => {
        this.setState(prevState => {
            return {...prevState, attributes: {
                ...prevState.attributes,
                [attribute.id]: selectedItem.value,
            }

            };
        });
    };
    generateAttributeItems = (attribute) => {
        return attribute.items.map(attributeItem =>
            <div className="attribute-item-container">
            <li id={attributeItem.id} style={{backgroundColor: (attribute.id == "Color") ? attributeItem.value : "#FFFFFF"}} 
            className={(this.state.attributes[attribute.id] != null) ? `attribute-item ${(this.state.attributes[attribute.id] === attributeItem.value) ? `attribute-item attribute-selected ${attribute.id}` : attribute.id}` : `attribute-item ${attribute.id}`}
            onClick={() => {this.setSelectedAttribute(attribute, attributeItem)}}

            >{(attribute.id == "Color") ? "" : attributeItem.displayValue}</li> 

            </div>);
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
                            {this.generateAttributes(product)}
                            <button className='product-buy-button'>Buy</button>
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
