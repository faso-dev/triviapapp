import React, {Component} from 'react';
import '../stylesheets/Header.css';
import {NavLink} from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <header className="fixed-top">
                <nav className='container navbar flex space-between items-center'>
                    <NavLink to='/' className='logo'>
                        <h2>Udacitrivia</h2>
                    </NavLink>
                    <ul className="items">
                        <li className="item">
                            <NavLink to={'/questions'}>List</NavLink>
                        </li>
                        <li className="item">
                            <NavLink to={'/add'}>Add question</NavLink>
                        </li>
                        <li className="item">
                            <NavLink to={'/play'}>Play</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;
