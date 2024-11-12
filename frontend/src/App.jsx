import ProductScreen from './screens/ProductScreen.jsx'
import React from "react";
import "./App.css";
import NavBar from './components/NavBar.jsx'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from './layouts/MainLayout.jsx'
import { gql } from '@apollo/client'
import { Query } from "@apollo/client/react/components";
import Products from "./components/Products.jsx";
import Cart from "./components/Cart.jsx";
import productScreenWithRouter from './screens/ProductScreen.jsx';



export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCartReady: false,
            isDimmed: false
        }
        this.cartRef = React.createRef();
    }

    GET_CATEGORIES = gql`query {
    products {
        category
    }
}`;
    handleAddProduct = (product) => {
        this.cartRef.current.addProduct(product);
    };

    toggleDim = () => {
        this.setState({isDimmed: !this.state.isDimmed});
    };
    getUniqueCategories(data) {
        const uniqueCategories = [];

        data.products.forEach(product => {
            if (!uniqueCategories.includes(product.category)) {
                uniqueCategories.push(product.category);
            }
        });

        return uniqueCategories;
    }
    isCartReady = () => {
        return this.state.isCartReady;
    }
    setIsCartReady = (bool) => {
        this.setState({ isCartReady: bool });
    }
    // DEBUGGING
    componentDidMount() {
    };

    render() {

        return (


            <Query query={this.GET_CATEGORIES}>
                {({ loading, error, data }) => {
                    if (data) {


                        const uniqueCategories = this.getUniqueCategories(data);
                        const firstCategory = uniqueCategories[0];
                        return <BrowserRouter>

                            <Cart setIsCartReady={this.setIsCartReady} ref={this.cartRef} />
                            {this.isCartReady() && <MainLayout cartRef={this.cartRef} />}

                            <Routes>
                                {/*Define static routes, followed by dynamic ones.*/}
                                
                                <Route path={`/product/:id`} element={<ProductScreen cartRef={this.cartRef} />} />
                                
                                <Route path={'/all'} element={<Products category={"all"} onProductAdd={this.handleAddProduct}/>} /> 
                                <Route key={firstCategory} index element={<Navigate to={'/all'} />} />
                                return {uniqueCategories.map(category => <Route key={category} path={`/${category}`}
                                    element={<Products category={category} onProductAdd={this.handleAddProduct} />}
                                    shouldRevalidate={true}
                                />)};


                            </Routes>
                        </BrowserRouter>
                    }
                }}
            </Query>
        );
    }
}
