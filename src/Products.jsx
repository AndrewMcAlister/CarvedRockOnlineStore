import React, { useState } from 'react';
import Spinner from './Spinner';
import useFetch from './services/useFetch';
import { useParams } from 'react-router-dom';
import PageNotFound from './PageNotFound';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

export default function Products() {
  const [size, setSize] = useState('');
  const { category } = useParams();

  const {data: products, error} = useSWR('products?category=' + category,useFetch());

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        <Link to={`/${category}/${p.id}`}>
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </Link>
      </div>
    );
  }

  function getSizes() {
    const sizeArray = [];
    products.map((p) =>
      p.skus.map((sku) => {
        if (!sizeArray.includes(sku.size)) sizeArray.push(sku.size);
        return sizeArray;
      }),
    );
    return sizeArray;
  }

  const filteredProducts = size
    ? products.filter((p) => p.skus.find((s) => s.size === size))
    : products;

  if (error) throw error;
  if (!products) return <Spinner />;
  if (products.length === 0) return <PageNotFound />;

  return (
    <>
      <section id="filters">
        <label htmlFor="size">Filter by Size:</label>{' '}
        <select
          id="size"
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
          }}
        >
          <option value="">All sizes</option>
          {getSizes().map((s) => (
            <option key={s} value={`${s}`}>
              {s}
            </option>
          ))}
        </select>
        {size && <h2>Found {filteredProducts.length} items</h2>}
      </section>
      <section id="products">{filteredProducts.map(renderProduct)}</section>
    </>
  );
}
