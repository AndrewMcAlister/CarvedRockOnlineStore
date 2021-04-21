const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getLastXTweets(x) {
  const response = await fetch(baseUrl + 'tweets');
  let allTweets = [];
  let lastxTweets = [];
  if (response.ok) {
    allTweets = await response.json();
    if (allTweets && allTweets.length > 0) {
      lastxTweets = allTweets.slice(-x);
      return lastxTweets;
    }
  } else throw response;
}

export async function createRandomTweet(products) {
  try {
    const names = ['Andrew', 'Simon', 'Olivia', 'Steven', 'Mariko', 'Somebody'];
    const randProdIndex = Math.round(Math.random() * (products.length - 1));
    const randNameIndex = Math.round(Math.random() * (names.length - 1));
    const randName = names[randNameIndex];
    const randProd = products[randProdIndex];
    const dte = new Date().getTime();
    console.log('creating tweet with date ' + new Date(dte).toString());

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

    await fetch(baseUrl + 'tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTweet),
    });
  } catch (e) {
    throw e;
  }
}

export function getWhenPart(date) {
  let message = '';
  let givenDate = new Date(date);
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
  let deletedCount = 0;

  try {
    let resp = await fetch(baseUrl + 'tweets');
    if (resp.ok) {
      let allTweets = await resp.json();
      if (allTweets && allTweets.length > 0) {
        allTweets.forEach((t) => {
          if (t.date < sellByDate) {
            deleteTweet(t);
            deletedCount++;
          }
        });
        console.log('Deleted ' + deletedCount + ' tweets');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteTweet(t) {
  console.log('Deleting tweet ' + JSON.stringify(t));
  if (t) {
    fetch(baseUrl + `tweets/${t.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(t),
    });
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
