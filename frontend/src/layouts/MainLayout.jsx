import React, { createRef } from 'react'
import NavBar from '../components/NavBar.jsx';
import PropTypes from 'prop-types'
export default class MainLayout extends React.Component{
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <NavBar cartRef={this.props.cartRef} /> 

        );
    }


}

MainLayout.PropTypes = {
    getCartItems: PropTypes.func
};
