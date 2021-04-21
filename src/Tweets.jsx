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
  const[tweets, setTweets] = useState([]);
  const tweetsPerPage = 6;

  const { data: products, error: errorProducts } = useSWR('products',useFetch());

  useEffect(() => {
    const intervalGetTweets = setInterval(() => 
      getLastXTweets(tweetsPerPage).then(resp=>setTweets(resp)),5000);
    return () => clearInterval(intervalGetTweets);
  },[])

  useEffect(() => {
    const intervalDeleteTweets = setInterval(() => deleteOldTweets(3),30000); //in a real situation, this would be a back-end job, but I only have json-server in this example
    return () => clearInterval(intervalDeleteTweets);
  },[]);

  useEffect(() => {
    const intervalCreateTweet = setInterval(() => createRandomTweet(products), 15000);
    return () => clearInterval(intervalCreateTweet);
  }, [products]);

  if (errorProducts) return 'No products available!';
  if (!tweets || tweets==='undefined' || tweets.length===0 || tweets==={}) return <Spinner />;
  
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
