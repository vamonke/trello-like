# Trello-like Web Application

Run `npm install` and `npm start` to start the server.

Go to http://localhost:3000/ to view the web application.

# Testing

Karma and Jasmine are used for unit tests for the web components. Please run `npm install` before running `npm test`.

In these unit tests, components are tested individually. Dummy data is passed into the components which are then checked for the correct output (HTML elements and their attributes/properties). 

User interactions of components are tested by simulating user actions such as click or submit form.

Components are also checked for the correct API calls without actually making a call to the server. This is done by stubbing  javascript's fetch() method with an observable function.

# Goals

- [x] display all columns with all cards
- [x] create a new card
- [x] modify a card
- [x] delete a card
- [x] add a column
- [x] modify a column
- [x] delete a column
- [x] search for any keywords presents on one or multiple cards without reloading the page
- [x] drag and drop a card from one column to another
- [x] click on a card to see its description