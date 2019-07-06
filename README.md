# Product-store

[![Build Status](https://travis-ci.org/FellRamos/Product-store.svg?branch=master)](https://travis-ci.org/FellRamos/Product-store)
![GitHub issues](https://img.shields.io/github/issues/FellRamos/Product-store.svg)

A simple Product Store RESTful API. This API contains three resources

- customers
- orders
- products

The application is running in Heroku where you can find the API documentation:

[Product store API documentation](https://fell-product-store.herokuapp.com/)

## Resources

The resource's operations were created from a consumer perspective. That means that the consumers have to create an account first, and then login to manipulate their own orders with the token provided.

> The **orders** resource is the only one protected by OAuth 2.0 and has operations to retrieve, update and delete these orders.
>
> The **products** resource is available to all, with operations to only retrieve the products available
>
> The **customers** resource has two operations. One to signup a new customer, and one to login a registered customer.

## Running on Local

Just download or clone the repo and execute **npm start**. It will run npm install due to the prestart script in package.json.

## Additional resources

Here you can find a Postman link to test all the routes, can be useful:

[Postman examples](https://documenter.getpostman.com/view/6023514/SVSDQX3N)
