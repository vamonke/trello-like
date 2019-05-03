import '/column.js';
import '/card.js';
import '/newCard.js';

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
    parentColumn.cards.push(card);
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

  // Render columns
  const main = document.querySelector('main');
  const columnElements = columns.map(column => {
    const el = document.createElement('column-element');
    el.column = column;
    main.appendChild(el);
    return el;
  });
}
