import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Spinner from './Spinner';
import Tweet from './Tweet';
import useFetch from './services/useFetch';
import {
  createRandomTweet,
  getLastXTweets,
  deleteOldTweets,
} from './services/tweetService';

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  //JSON server only just copes with these parameters
  const tweetsPerPage = 6;
  const getTweetsIntervalSec = 5;
  const deleteTweetsOverMinsOld = 10;
  const createTweetIntervalSec=5;
  const deleteTweetIntervalSec=10;

  const { data: products, error: errorProducts } = useSWR(
    'products',
    useFetch(),
  );

  useEffect(() => {
    const intervalGetTweets = setInterval(
      () =>
        getLastXTweets(tweetsPerPage).then((tweets) => {
          if (tweets.length > 0) setTweets(tweets);
        }),
      getTweetsIntervalSec*1000,
    );
    return () => clearInterval(intervalGetTweets);
  }, []);

  useEffect(() => {
    const intervalDeleteTweets = setInterval(
      () => deleteOldTweets(deleteTweetsOverMinsOld),
      deleteTweetIntervalSec*1000,
    ); //in a real situation, this would be a back-end job, but I only have json-server in this example
    return () => clearInterval(intervalDeleteTweets);
  }, []);

  useEffect(() => {
    const intervalCreateTweet = setInterval(
      () => createRandomTweet(products),
      createTweetIntervalSec*1000,
    );
    return () => clearInterval(intervalCreateTweet);
  }, [products]);

  if (errorProducts) return "Json-server has quit!  It has trouble with deletion as it is only mean't for testing";
  if (!tweets || tweets === 'undefined' || tweets.length === 0 || tweets === {})
    return <Spinner />;

  return (
    <section id="tweets">
      <div className="divide-y divide-grey-200">
        {[...tweets]?.reverse().map((tweet) => (
          <div className="px-4 py-2" key={tweet.id}>
            <Tweet tweet={tweet} />
          </div>
        ))}
      </div>
    </section>
  );
}
