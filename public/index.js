import '/column.js';
import '/card.js';
import '/addCard.js';
import '/addColumn.js';
import '/columnTitle.js';
import Search from '/search.js';

window.addEventListener('load', () => {
  fetchColumns();
});

async function attachCards(columns) {
  // Fetch cards from database
  const res = await fetch("http://localhost:3000/cards");
  const cards = await res.json();
  
  // Match cards to respective columns
  cards.forEach(card => {
    let parentColumn = columns.find(column => column.id == card.columnId);
    if (parentColumn) {
      parentColumn.cards.push(card);
    } else {
      console.error(card);
    }
  });
}

async function fetchColumns() {
  // Fetch columns from database
  const res = await fetch("http://localhost:3000/columns");
  let columns = await res.json();

  // Attach cards to columns
  columns.forEach(column => {
    column.cards = [];
  });
  await attachCards(columns);

  
  const main = document.querySelector('main');
  // Render search
  let searchElement = document.createElement(Search.tag);
  searchElement.search = {};
  let parentDiv = main.parentNode;
  parentDiv.insertBefore(searchElement, main);

  // Render columns
  const columnElements = columns.map(column => {
    const el = document.createElement('column-element');
    el.column = column;
    main.appendChild(el);
    return el;
  });

  let addColumnElement = document.createElement('add-column');
  addColumnElement.addColumn = {};
  main.appendChild(addColumnElement);
}