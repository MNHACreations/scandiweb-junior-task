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
getUniqueCategories(data) {
    let uniqueCategories = [];

    data.products.forEach(product => {
        if  (!uniqueCategories.includes(product.category)) {
            uniqueCategories.push(product.category);
        }
    });

    
    return uniqueCategories.map(category =>
         <NavLink key={category} to={`/${category}`}
        className={({isActive}) => isActive ? 'active-navitem' 
            : 'navitem'}>{category.toUpperCase()}</NavLink>
    )
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


                        return <div id="navbar">
                            <div className="navbar-content">
                                {this.getUniqueCategories(data)}


                                
                            </div>
                            <img src={cartLogo} id="cart-logo" />
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
