import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from './services/shippingService';
import useFetch from './services/useFetch';
import Spinner from './Spinner';
import { v4 as uuidv4 } from 'uuid';

const STATUS = {
  IDLE: 'IDLE',
  SUBMITTED: 'SUBMITTED',
  SUBMITTING: 'SUBMITTING',
  COMPLETED: 'COMPLETED',
};

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  transId: '',
  name: '',
  email:'',
  address1: '',
  address2: '',
  citysuburb: '',
  state: '',
  country: '',
};

export default function Checkout() {
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Derived state
  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  const { data: countries, countriesLoading, countriesError } = useFetch(
    'countries',
  );

  function handleChange(e) {
    e.persist(); // persist the event
    setAddress((curAddress) => {
      return {
        ...curAddress,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleBlur(event) {
    event.persist();
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    if (isValid) {
      try {
        const transId = uuidv4();
        address.transId = transId;
        await saveShippingAddress(address);
        navigate(`/payment/${transId}`);
        setStatus(STATUS.COMPLETED);
      } catch (e) {
        setSaveError(e);
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  function getErrors(address) {
    const result = {};
    if (!address.name) result.name = 'Name is required';
    if (!address.email) result.email = 'Email is required';
    if (!address.address1) result.address1 = 'Address 1 is required';
    if (!address.citysuburb) result.citysuburb = 'City or suburb is required';
    if (!address.state) result.state = 'State is required';
    if (!address.country) result.country = 'Country is required';
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED) {
    return <h1>Thanks for shopping checkout!</h1>;
  }

  if (countriesLoading) return <Spinner />;
  if (countriesError) throw countriesError;

  return (
    <>
      <h1>Shipping Info</h1>
      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.keys(errors).map((key) => {
              return <li key={key}>{errors[key]}</li>;
            })}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            type="text"
            value={address.name}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.name || status === STATUS.SUBMITTED) && errors.name}
          </p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={address.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.email || status === STATUS.SUBMITTED) && errors.email}
          </p>
        </div>        
        <div>
          <label htmlFor="address1">Address Line 1</label>
          <br />
          <input
            id="address1"
            type="text"
            value={address.line1}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.line1 || status === STATUS.SUBMITTED) && errors.line1}
          </p>
        </div>
        <div>
          <label htmlFor="address2">Address Line 2</label>
          <br />
          <input
            id="address2"
            type="text"
            value={address.line2}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.line2 || status === STATUS.SUBMITTED) && errors.line2}
          </p>
        </div>
        <div>
          <label htmlFor="citysuburb">City or Suburb</label>
          <br />
          <input
            id="citysuburb"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.citysuburb || status === STATUS.SUBMITTED) &&
              errors.citysuburb}
          </p>
        </div>
        <div>
          <label htmlFor="state">State</label>
          <br />
          <input
            id="state"
            type="text"
            value={address.state}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.state || status === STATUS.SUBMITTED) && errors.state}
          </p>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            {countries &&
              countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <p role="alert">
            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
        </div>
        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
