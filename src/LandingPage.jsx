import React from 'react';

export default function LandingPage() {
  return (
    <div className="container">
      <div className="row">
        <h1 className="col section-1 section-description">
          Welcome to Carved Rock Fitness
        </h1>
      </div>
      <div className="row">
        <h3 className="col-md-12 ">
          This online shop is based on the Pluralsight course 'Managing React
          State' by Cory House. I have developed it in the following ways...
        </h3>
      </div>
      <div className="row">
        <h3 className="col-md-12">
          <ul>
            <li>Customer address capture at checkout</li>
            <li>Payment information capture and validation</li>
            <li>
              Code has been refactored to separate state controlling components
              from view components, ie the checkout component now holds the
              state and there are address and payment components.
            </li>
          </ul>
        </h3>
      </div>
    </div>
  );
}
