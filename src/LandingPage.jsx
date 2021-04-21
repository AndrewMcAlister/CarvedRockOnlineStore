import React from 'react';
import Tweets from './Tweets';

export default function LandingPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10">
          <h1 className="col section-1 section-description">
            Welcome to Carved Rock Fitness
          </h1>
          <h3 className="col-md-12 ">
            This online shop is based on the Pluralsight course 'Managing React
            State' by Cory House. I have developed it in the following ways...
          </h3>
          <h3 className="col-md-12">
            <ul>
              <li>Customer address capture at checkout</li>
              <li>Payment information capture and validation</li>
              <li>
                Code has been refactored to separate state controlling
                components from view components, ie the checkout component now
                holds the state and there are address and payment components.
              </li>
              <li>
                I have added SWR caching, and a 1 sec delay to product retrieval to show highligh caching (but not on cart).
              </li>
              <li>
                I have added random customer purchase tweets
              </li>
            </ul>
          </h3>
        </div>
        <div className="col">
          <Tweets />
        </div>
      </div>
    </div>
  );
};
