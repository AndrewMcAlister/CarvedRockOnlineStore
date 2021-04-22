const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getPaymentByTransId(transId) {
  const response = await fetch(baseUrl + 'payments?transId=' + transId);
  if (response.ok) {
    return await response.json();
  } else throw response;
}

export async function savePayment(payment) {
  try {
    let existing = await getPaymentByTransId(payment.transId);
    console.log(JSON.stringify(existing));
    if (!existing||existing.length===0) {  
      debugger;    
      //payment is sent to back-end api and is successful, now clear card no (except last 4 digits) and save payment
      payment.cardNo = payment.cardNo.slice(-4);
      payment.success = true;
      await fetch(baseUrl + 'payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });
    }
  } catch (e) {
    throw e;
  }
}
