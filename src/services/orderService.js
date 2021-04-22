const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const ORDER_STATUS = {
  PAYMENTPENDING: 'PAYMENTPENDING',
  PAYMENTSUCCESS: 'PAYMENTSUCCESS',
  ORDERPROCESSING: 'SUBMITTING',
  ORDERSENT: 'ORDERSENT',
};

export async function getOrderByTransId(transId) {
  const response = await fetch(baseUrl + 'orders?transId=' + transId);
  if (response.ok) return await response.json();
  throw response;
}

export async function saveOrder(cart, transId) {
  let orderId = -1;
  let dte = Date(Date.now());
  const order = {
    transId: transId,
    cart: cart,
    orderDate: dte,
    status: ORDER_STATUS.PAYMENTPENDING,
  };
  try {
    await fetch(baseUrl + 'orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    let orderArray = await getOrderByTransId(transId);
    if (orderArray.length > 0) orderId = orderArray[0].id;
  } catch (e) {
    console.log(e);
  }

  return orderId;
}
