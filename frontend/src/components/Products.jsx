import React from "react";
import { gql, ApolloProvider, useQuery } from '@apollo/client';
import { Query } from '@apollo/client/react/components'
import Product from './Product'
import PropTypes from 'prop-types'
import { stringifyForDisplay } from "@apollo/client/utilities";
import SkeletonProduct from "./SkeletonProduct";
export default class Products extends React.PureComponent {

    // Declaring the fetching schema:
    constructor(props) {
        super(props);


    }

    componentDidMount() {
        this.setState({ category: this.props.category });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.category != this.props.category) {
            this.setState({ category: prevProps.category });
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
        }
    }`
    


    toKebabCase = (string) => {
        return string.toLowerCase().replaceAll(" ", "-");
    }
    getProducts(data) {
        return data.products.map(product => <Product key={product.id} productJson={product} onProductAdd={this.props.onProductAdd} />);
    }
    capitalize = (string) => {
        let capitalized = string[0].toUpperCase();
        return capitalized + String(string).replace(String(string).at(0), '');
    }
    render() {
        return (

            <Query query={this.GET_PRODUCTS} variables={{ category: this.props.category }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <div> <h1 className="absolute top-24 left-24 font-raleway font-normal"> {this.capitalize(this.props.category)}</h1>
                            <div id="products-container" className="flex flex-wrap justify-evenly gap-16 mt-40">
                                <SkeletonProduct skeletons={15} /> 
                            </div>
                        </div>
                    }

                    if (error) {
                        return <p>Error {error.graphQLErrors[0].message}</p>
                    }

                    if (data) {
                        return <div>


                            <h1 className="absolute top-24 left-24 font-raleway font-normal"> {this.capitalize(this.props.category)}</h1>
                            <div id="products-container" className="flex flex-wrap justify-evenly gap-16 mt-40">
                                {this.getProducts(data)} </div>
                        </div>



                    }
                }}
            </Query>

        )
    };
}


Products.propTypes = {
    category: PropTypes.string
}

