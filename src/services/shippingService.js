const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getShippingAddress(transId) {
  return fetch(baseUrl + 'shippingAddress/' + transId).then((response) => {
    if (response.ok) return response.json();
    throw response;
  });
}

export async function saveShippingAddress(address) {
  return fetch(baseUrl + 'shippingAddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });
}
