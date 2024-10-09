import React from 'react'
import { NavLink } from 'react-router-dom'
import { ApolloClient, gql } from '@apollo/client'
import { Query } from '@apollo/client/react/components';
import cartLogo from '../../assets/cart.svg'
const GET_CATEGORIES = gql`query {
    products {
        category
    }
}`


export default class NavBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {cartSize: 0};
        this.cartUpdateInterval = React.createRef();

    }
    getUniqueCategories(data) {
        let uniqueCategories = [];

        data.products.forEach(product => {
            if  (!uniqueCategories.includes(product.category)) {
                uniqueCategories.push(product.category);
            }
        });
        return uniqueCategories.map(category => (
            <NavLink 
            key={category} 
            to={`/${category}`}
            className={({ isActive }) => isActive ? 'active-navitem' : 'navitem'}
            data-testid={category === window.location.pathname.slice(1) ? "active-category-link" : "category-link"}
            >
            {category.toUpperCase()}
            </NavLink>
        ));

    }

    componentWillUnmount(){
        clearInterval(this.cartUpdateInterval.current);
    };
    componentDidMount(){    
        this.cartUpdateInterval.current = setInterval(() => {
            this.setState({cartSize: this.props.cartRef.current.getCartSize()}); 
        }, 50);
    }
    render(){
        return (

            <Query query={GET_CATEGORIES}>
            {({loading, error, data}) => {
                if (loading) {
                    return <p>Loading...</p>
                }

                if (error) {
                    return <p>Error {error.graphQLErrors[0].message}</p>
                }
                if (data) {
                    return <div id="navbar" className='z-40 flex justify-between items-center p-1.5'>
                        <div className="navbar-content">
                        {this.getUniqueCategories(data)}



                        </div>
                        <div  data-testid='cart-btn' className='navbar-cart-container' onClick={() => {this.props.cartRef.current.toggleCart()}}>
                        <img src={cartLogo} id="navbar-cart-logo" />
                        <span style={{display: (this.state.cartSize < 1) ? "none" : "inline"}} className="navbar-cart-size">{this.state.cartSize}</span>
                        </div>
                        </div>


                }
            }}

            </Query>


            //                <NavLink to="/men" className={({isActive}) => isActive ? 'active-navitem' : 'navitem'}>Men</NavLink>
            //              <NavLink to="/women" className={({isActive}) => isActive ? 'active-navitem' : 'navitem'}>Women</NavLink>
            //            <NavLink to="/kids" className={({isActive}) => isActive ? 'active-navitem' : 'navitem'}>Kids</NavLink>
            //       </div>
        )

    }



}
