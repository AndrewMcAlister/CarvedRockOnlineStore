const baseUrl = process.env.REACT_APP_API_BASE_URL;
const deleteBatchSize = 3;

export async function getLastXTweets(x) {
  let lastxTweets = [];
  try {
    const response = await fetch(baseUrl + 'tweets');
    let allTweets = [];
    if (response.ok) {
      allTweets = await response.json();
      if (allTweets && allTweets.length > 0) {
        lastxTweets = allTweets.slice(-x);
      }
    } else console.log('getLastXTweets returned ' + response.status);
  } catch (e) {
    console.log(e);
  } finally {
    return lastxTweets;
  }
}

export async function createRandomTweet(products) {
  try {
    const names = ['Andrew', 'Simon', 'Olivia', 'Steven', 'Mariko', 'Somebody'];
    const randProdIndex = Math.round(Math.random() * (products.length - 1));
    const randNameIndex = Math.round(Math.random() * (names.length - 1));
    const randName = names[randNameIndex];
    const randProd = products[randProdIndex];
    const dte = Date(Date.now());
    console.log('creating tweet with date ' + dte.toString());

    let newTweet = {
      name: randName,
      image: randName + '.jpg',
      date: dte,
      actionMessage:
        randName +
        ' purchased a ' +
        randProd.name +
        ' ' +
        pluralToSingular(randProd.category),
    };

    let response = await fetch(baseUrl + 'tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTweet),
    });
    if (!response.ok) console.log(response);
    else return response;
  } catch (e) {
    console.log(e);
  }
}

export function getWhenPart(date) {
  let message = '';
  let givenDate = +new Date(date);
  let minutesPast = Math.round((Date.now() - givenDate) / 1000 / 60);
  if (minutesPast > 120) message = '';
  else if (minutesPast > 80) message = 'about 1 1/2 hours ago';
  else if (minutesPast > 55) message = 'about an hour ago';
  else if (minutesPast > 1) message = minutesPast + ' minutes ago';
  else if (minutesPast <= 1) message = 'just now';

  return message + '.';
}

export async function deleteOldTweets(mins) {
  let sellByDate = +new Date() - parseInt(mins) * 60 * 1000;
  try {
    let resp = await fetch(baseUrl + 'tweets');
    if (resp.ok) {
      let allTweets = await resp.json();
      if (allTweets && allTweets.length > 0) {
        let delTweets = allTweets.filter((t) => {
          return (sellByDate - +new Date(t.date)) / 60000 > 0;
        });
        console.log(
          'Delete called with ' + delTweets.length + ' left to delete',
        );
        //delete small batches of 3 at a time or Json server fails
        delTweets.slice(0, deleteBatchSize).forEach(async (t) => {
          setTimeout(async () => await deleteTweet(t), 3000);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteTweet(t) {
  console.log(`Deleting tweet ${t.id} created ${t.date}`);
  try {
    const resp = await fetch(baseUrl + `tweets/${t.id}`, {
      method: 'DELETE',
      body: null,
    });
    return resp;
  } catch (e) {
    console.log(e);
  }
}

function pluralToSingular(word) {
  let singular = '';
  if (word.length > 3 && word.slice(-3) === 'ies')
    singular = word.slice(0, word.length - 3);
  else if (word.slice(-1) === 's') singular = word.slice(0, word.length - 1);
  else singular = word;

  return singular;
}
