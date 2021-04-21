import React, { useState } from 'react';
import { savePayment } from './services/paymentService';
import { useCart } from './cartContext';
import { useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import useFetchAll from './services/useFetchAll';
import Spinner from './Spinner';
import { saveOrder } from './services/orderService';

const flatRateShipping = 15;
const taxPercent = 10;

const STATUS = {
  IDLE: 'IDLE',
  SUBMITTED: 'SUBMITTED',
  SUBMITTING: 'SUBMITTING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

// Declaring outside component to avoid recreation on each render
const emptyPayment = {
  transId: '',
  paymentType: '',
  nameOnCard: '',
  cardNo: '',
  expiry: '',
  csc: '',
  processed: false,
  success: false,
};

export default function Payment() {
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const { cart, dispatch } = useCart();
  const urls = cart.map((i) => `products/${i.id}`);
  const { data: products, loading: productsloading, error } = useFetchAll(urls);
  const { transId } = useParams();
  const [payment, setPayment] = useState({ ...emptyPayment, transId: transId });
  const [orderId, setOrderId] = useState('');
  //  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  function calcCartTotals(cart, u) {
    let totals = {
      valueInCart: 0,
      shipping: 0,
      taxAmount: 0,
      total: 0,
    };
    if (cart.length > 0 && !productsloading) {
      totals.valueInCart = cart.reduce(
        (total, item) =>
          total +
          item.quantity *
            products.find((s) => s.id === parseInt(item.id)).price,
        0,
      );
      totals.shipping = flatRateShipping;
      totals.taxAmount = +((taxPercent / 100) * totals.valueInCart).toFixed(2);
      totals.total = totals.shipping + totals.taxAmount + totals.valueInCart;
    }
    return totals;
  }

  function expiryDateIsValid(exp) {
    let result = false;
    try {
      let monthPartOk = false;
      let yearPartOk = false;

      const monthPart = parseInt(payment.expiry.substring(0, 2));
      if (monthPart < 13 && monthPart > 0) monthPartOk = true;

      const yearPart = parseInt(payment.expiry.substring(3, 5));
      if (yearPart > 20) yearPartOk = true;

      if (yearPartOk && monthPartOk) result = true;
    } catch {}
    return result;
  }

  // Derived state
  const errors = getErrors(payment);
  const isValid = Object.keys(errors).length === 0;
  const cartTotals = calcCartTotals(cart, urls);

  function handleChange(e) {
    e.persist(); // persist the event
    setPayment((curPayment) => {
      return {
        ...curPayment,
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
    setPayment({ ...payment, transId: transId });
    setStatus(STATUS.SUBMITTING);
    if (isValid) {
      try {
        if (cart.length > 0) {
          await savePayment(payment);
          let orderId= await saveOrder(cart, transId);
          if (orderId>0) {
            setOrderId(orderId);
            setStatus(STATUS.COMPLETED);
            dispatch({ type: 'empty' });
          }
          else throw new Error("Sorry, an order number couldn't be generated, we will send it later.");
        }
      } catch (e) {
        setSaveError(e);
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  function getErrors(payment) {
    const result = {};
    if (!payment.paymentType) result.paymentType = 'Payment type is required.';
    if (payment.paymentType !== 'PayPal') {
      if (!payment.nameOnCard) result.nameOnCard = 'Name on card is required.';
      if (!payment.cardNo) result.cardNo = 'Card number is required.';
      if (payment.cardNo && !payment.cardNo.length === 20)
        result.cardNo =
          (result.cardNo.length > 0 ? '  ' : '') + 'Card number is incomplete.';
      if (!payment.expiry) result.expiry = 'Card expiry is required.';
      else {
        if (!expiryDateIsValid(payment.expiry))
          result.expiry = 'Card expiry is incorrect, please enter mm/yy.';
      }
      if (!payment.csc) result.csc = 'Card security number is required.';
      else {
        const cscNum = parseInt(payment.csc);
        if (isNaN(cscNum) || cscNum < 1 || cscNum > 999)
          result.csc = 'Card security number is invalid.';
      }
    }
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED && orderId) {
    return <h1>Your order Id is {orderId}.<br/> Thanks for shopping!</h1>;
  }

  if (productsloading) return <Spinner />;
  if (error) throw error;

  return (
    <>
      <h1>Payment Info</h1>
      <p>Transaction Id: {transId}</p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="carttotals">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label>Total in cart</label>
            </td>
            <td className="carttotals">
              <div>{cartTotals.valueInCart.toFixed(2)}</div>
            </td>
          </tr>
          <tr>
            <td>
              <label>Shipping</label>
            </td>
            <td className="carttotals">
              <div>{cartTotals.shipping.toFixed(2)}</div>
            </td>
          </tr>
          <tr>
            <td>
              <label>Tax</label>
            </td>
            <td className="carttotals">
              <div>{cartTotals.taxAmount.toFixed(2)}</div>
            </td>
          </tr>
          <tr>
            <td>
              <label>Total</label>
            </td>
            <td className="carttotals">
              <div>{cartTotals.total.toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <form onSubmit={handleSubmit} className="row col-md-6">
        <div className="form-group col-md-12">
          <label htmlFor="paymentType">Payment Type</label>
          <br />
          <select
            id="paymentType"
            value={payment.paymentType}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="PayPal">PayPal</option>
            <option default value="CreditCard">
              Credit Card
            </option>
          </select>
          <p role="alert">
            {(touched.paymentType || status === STATUS.SUBMITTED) &&
              errors.paymentType}
          </p>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nameOnCard">Name on card:</label>
          <br />
          <input
            id="nameOnCard"
            type="text"
            value={payment.nameOnCard}
            onBlur={handleBlur}
            onChange={handleChange}
            size="35"
          />
          <br />
          <p role="alert">
            {(touched.nameOnCard || status === STATUS.SUBMITTED) &&
              errors.nameOnCard}
          </p>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="cardNo">Card number:</label>
          <br />
          <InputMask
            id="cardNo"
            type="text"
            value={payment.cardNo}
            onBlur={handleBlur}
            onChange={handleChange}
            maskplaceholder="_"
            mask="9999-9999-9999-9999"
            alwaysShowMask={true}
            maskChar="_"
            size="18"
          />
          <br />
          <p role="alert">
            {(touched.cardNo || status === STATUS.SUBMITTED) && errors.cardNo}
          </p>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="expiry">Expiry:</label>
          <br />
          <InputMask
            id="expiry"
            type="text"
            value={payment.expiry}
            onBlur={handleBlur}
            onChange={handleChange}
            maskplaceholder="_"
            mask="99/99"
            alwaysShowMask={true}
            maskChar="_"
            size="3"
          />
          <br />
          <p role="alert">
            {(touched.expiry || status === STATUS.SUBMITTED) && errors.expiry}
          </p>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="csc">Card Security Number:</label>
          <br />
          <InputMask
            id="csc"
            type="text"
            value={payment.csc}
            onBlur={handleBlur}
            onChange={handleChange}
            maskplaceholder="_"
            mask="999"
            alwaysShowMask={true}
            maskChar="_"
            size="2"
          />
          <br />
          <p role="alert">
            {(touched.csc || status === STATUS.SUBMITTED) && errors.csc}
          </p>
        </div>
        <div className="col-md-12">
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Payment Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
