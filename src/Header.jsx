import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from './cartContext';

const activeStyle = {
  color: "purple",
};

export default function Header() {
  const {cart} = useCart();  

  const cartQty = () => {
    let totqty=0;
    if (cart.length > 0) {
      totqty = cart.reduce(
        (totqty, item) =>
        totqty + item.quantity,0)
    }
    return totqty;
  }  

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img alt="Carved Rock Fitness" src="/images/logo.png" />
            </Link>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to="/backpacks">
              Backpacks
            </NavLink>
          </li>          
          <li>
            <NavLink activeStyle={activeStyle} to="/shoes">
              Shoes
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to="/cart">
              Cart ({cartQty()} items)
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
