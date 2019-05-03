class Column extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set column(column) {
    // Bind methods
    this.addCard = this.addCard.bind(this);

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
    newCardElement.newCard = { columnId: column.id, addCard: this.addCard };
    section.appendChild(newCardElement);
  }

  async addCard(title, description, columnId) { // Add card to column
    // POST new card to server
    const res = await fetch('http://localhost:3000/cards', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, columnId })
    });
    if (res.ok) {
      // Append newly created card
      const createdCard = await res.json();
      const cardElement = document.createElement('card-element');
      cardElement.card = createdCard;
      let cardsContainer = this.root.querySelector('.cards-container');
      cardsContainer.appendChild(cardElement);
    } else {
      alert("Error ocurred");
    }
  }
}

customElements.define("column-element", Column);