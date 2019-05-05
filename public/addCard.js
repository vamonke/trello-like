export default class AddCard extends HTMLElement {
  static get tag() {
    return "add-card";
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set addCard(addCard) {
    // Bind methods
    this.createCard = this.createCard.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.root.innerHTML = `
      <style>
        @import "form.css";
        form {
          background-color: #FFFFFF;
          border-radius: 3px;
          padding: 12px;
          margin-top: 12px;
          
          -webkit-box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
          -moz-box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
          box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
        }
        input[type="text"], textarea {
          box-sizing: border-box;
          margin-bottom: 8px;
          width: 100%;
          max-width: 100%;
        }
        textarea {
          min-height: 80px;
        }
        .showForm {
          max-width: 100px;
          text-align: center;
          margin: 13px auto 0;
          left: 0;
          right: 0;
          cursor: pointer;
          padding: 5px 8px;
          opacity: 0.4;
          position: relative;
        }
        .showForm:before {
          font-family: "FontAwesome";
          display: inline-block;
          font-weight: 900;
          margin-right: 5px;
          content: "\\f067";
        }
        .showForm:hover {
          opacity: 1;
        }
      </style>
      <div class="showForm">Add a card</div>
      <form style="display: none">
        <input type="text" placeholder="Title" name="title" required><br>
        <textarea placeholder="Description" name="description"></textarea><br>
        <input type="hidden" value="${addCard.columnId}" name="columnId">
        <input type="button" value="Cancel"> <input type="submit" value="Add">
      </form>
    `;
  }
  
  toggleForm() { // Toggle display of form and 'Add add card' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";
    const showButton = this.root.querySelector('.showForm');
    showButton.style.display = showButton.style.display === "none" ? "block" : "none";
    form.querySelector('input[name="title"]').focus();
  }

  async createCard(title, description, columnId) { // Add card to column
    // POST add card to server
    const res = await fetch('http://localhost:3000/cards', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, columnId })
    });
    if (res.ok) {
      // Append addly created card
      const createdCard = await res.json();
      const cardElement = document.createElement('card-element');
      cardElement.card = createdCard;
      cardElement.setAttribute('title', createdCard.title);
      cardElement.setAttribute('id', createdCard.id);
      cardElement.setAttribute('description', createdCard.description);
      cardElement.setAttribute('columnId', createdCard.columnId);
      const cardsContainer = this.parentNode.querySelector('.cards-container');
      cardsContainer.appendChild(cardElement);
    } else {
      alert("Error ocurred");
    }
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();

    // Get add card details
    const titleInput = this.root.querySelector('input[name="title"]');
    const descriptionInput = this.root.querySelector('textarea[name="description"]');
    const columnIdInput = this.root.querySelector('input[name="columnId"]');
    const title = titleInput.value;
    const description = descriptionInput.value;
    const columnId = columnIdInput.value;

    if (this.parentNode) {
      const allCards = this.parentNode.querySelectorAll('card-element');
      const allCardTitles = Array.from(allCards).map(card => card.title);
      if (allCardTitles.includes(title)) {
        return alert("There is a card with the same title!");
      }
    }

    await this.createCard(title, description, columnId);
    
    // Reset form
    this.toggleForm();
    titleInput.value = '';
    descriptionInput.value = '';
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    // Toggle form listener
    const showButton = this.root.querySelector('.showForm');
    const cancelButton = this.root.querySelector('input[value="Cancel"]');
    showButton.addEventListener('click', this.toggleForm, false);
    cancelButton.addEventListener('click', this.toggleForm, false);
    
    // Submit form listener
    const form = this.root.querySelector('form');
    form.addEventListener('submit', this.handleSubmit, false);
  }
}

customElements.define(AddCard.tag, AddCard);
