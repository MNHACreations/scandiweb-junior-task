import { withRouter } from '../core/withRouter'
import React from 'react'
import PropTypes from 'prop-types'
import {gql} from '@apollo/client'
import { Query } from '@apollo/client/react/components'
class ProductScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        mainImage: undefined 
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
        gallery
        attributes{
            id
            name
        }
    }
}`
    generateAttributes = (product) => {
        return product.attributes.map(attribute => <div 
            className={attribute.name}> {attribute.name} </div>);
    }
    getImageList = (product) => {
        return product.gallery.map(pic => <img onMouseOver={() => {this.changeFocusedImage(pic)}} src={pic} className="preview-image"  />);
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
                        <div className='images-section'>
                        <div className='preview-image-container'>
                            {this.getImageList(product)}
                        </div>
                        <div className={"main-image-container"}>

                        {(this.state.focusedImage != null) ? <img className='main-image' src={this.state.focusedImage} /> : <img className="main-image" src={data.product.gallery[0]} />} 
                       </div> 
                        </div>
                            <div className="text-section">
                                <h1>{product.name}</h1>
                                {this.generateAttributes()} 
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
