export default class Column extends HTMLElement {
  static get tag() {
    return "column-element";
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set column(column) {
    this.root.innerHTML = `
    <style>
      section {
        white-space: initial;
        background-color: #DDDDDD;
        display: inline-block;
        vertical-align: top;
        width: 300px;
        padding: 8px;
      }
    </style>
    <section></section>`;

    let section = this.root.querySelector('section');
    
    // Append column title
    let columnTitle = document.createElement('column-title');
    columnTitle.columnTitle = column;
    section.appendChild(columnTitle);

    // Append cards
    let cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    if (column.cards) {
      column.cards.forEach(card => {
        let cardElement = document.createElement('card-element');
        cardElement.card = card;
        cardsContainer.appendChild(cardElement);
      })
    }
    section.appendChild(cardsContainer);


    // Append new card form
    let newCardElement = document.createElement('new-card');
    newCardElement.newCard = { columnId: column.id };
    section.appendChild(newCardElement);
  }
}

customElements.define(Column.tag, Column);