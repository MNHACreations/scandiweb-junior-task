import React from "react";
import { gql, ApolloProvider, useQuery } from '@apollo/client';
import { Query } from '@apollo/client/react/components'
import Product from './Product'
import PropTypes from 'prop-types'
import { stringifyForDisplay } from "@apollo/client/utilities";
export default class Products extends React.PureComponent {

  // Declaring the fetching schema:
    constructor(props) {
        super(props);
         

    }

    componentDidMount() {
        this.setState({category: this.props.category});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.category != this.props.category) {
            this.setState({category: prevProps.category});
        }
    }

 GET_PRODUCTS = gql`query($category: String!) {
    products(category: $category) {
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
    }
}`



   getProducts(data) {
        return data.products.map(product => <Product key={product.id} productJson={product} onProductAdd={this.props.onProductAdd} />); 
   } 
render() {
    return (
        
        <Query query={this.GET_PRODUCTS} variables={{category: this.props.category}}>
            {({loading, error, data}) => {
                if (loading) {
                    return <p>Loading...</p>
                }

                if (error) {
                    return <p>Error {error.graphQLErrors[0].message}</p>
                }

                if (data) {
                          return <div id="products-container">{this.getProducts(data)} </div>




                }
            }}
        </Query>

    )
};
}


Products.propTypes = {
    category: PropTypes.string
}

