import { Link } from "react-router-dom"

import { ReactComponent as Phone } from "../../assets/phone.svg"

const Product = ({ product }) => {
  return (
    <div className="product">
      <Link
        className="product-link"
        to={`/catalog/${product.id}`}
      >
        <div className="image">
          <img
            src={product.images[0]}
            alt=""
          />
        </div>
        <div className="information">
          <p className="name">{product.name}</p>
          <p
            className="instock"
            style={{ color: product.inStock ? "green" : "red" }}
          >
            {product.inStock ? "• in stock" : "• out of stock"}
          </p>
        </div>
      </Link>
      <Link
        className="product-shop"
        to="/about"
      >
        <div className="shop">
          <p className="price">{product.price}</p>
          {/* STC */}
          <Phone className="cart" />
          <span className="go-to-contacts-text">go to contacts</span>
          {/* STC */}
        </div>
      </Link>
    </div>
  )
}

export default Product
