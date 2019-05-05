export default class Column extends HTMLElement {
  static get tag() {
    return "column-element";
  }
  get title() {
    return this.getAttribute('title');
  }
  get id() {
    return this.getAttribute('id');
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set column(column) {
    // Bind methods
    this.drop = this.drop.bind(this);
    this.dragOver = this.dragOver.bind(this);

    this.root.innerHTML = `
    <style>
      section {
        white-space: initial;
        background-color: #E2E2E2;
        display: inline-block;
        vertical-align: top;
        width: 300px;
        padding: 10px;
        border-radius: 5px;
      }
    </style>
    <section></section>`;

    let section = this.root.querySelector('section');
    
    // Append column title
    let columnTitle = document.createElement('column-title');
    columnTitle.columnTitle = column;
    columnTitle.setAttribute('title', column.title);
    section.appendChild(columnTitle);

    // Append cards
    let cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    if (column.cards) {
      column.cards.forEach(card => {
        let cardElement = document.createElement('card-element');
        cardElement.card = card;
        cardElement.setAttribute('title', card.title);
        cardElement.setAttribute('id', card.id);
        cardsContainer.appendChild(cardElement);
      })
    }
    section.appendChild(cardsContainer);

    // Append new card form
    let addCardElement = document.createElement('add-card');
    addCardElement.addCard = { columnId: column.id };
    section.appendChild(addCardElement);
  }

  async updateCard(card) {
    if (card.columnId === this.id) {
      // Do nothing if dragged into original column
      return null;
    }

    // Check for conflict with existing cards
    const cards = this.shadowRoot.querySelectorAll('card-element');
    const cardTitles = Array.from(cards).map(card => card.title);
    if (cardTitles.includes(card.title)) {
      return alert("There is another card with the same title in this column!");
    }
    
    // PUT edited card to server
    card.columnId = this.id;
    const res = await fetch('http://localhost:3000/cards/' + card.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
    });
    
    if (res.ok) {
      // TODO: Remove card from previous column and append card to new column
      location.reload();
    } else {
      alert("Error ocurred");
    }
  }

  drop(e) {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("text/plain"));
    this.updateCard(card);
  }

  dragOver(e) {
    e.preventDefault();
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    // Drag listener
    const section = this.root.querySelector('section');
    section.addEventListener('drop', this.drop, false);
    section.addEventListener('dragover', this.dragOver, false);
  }
}

customElements.define(Column.tag, Column);