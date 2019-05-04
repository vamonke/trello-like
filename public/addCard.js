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
    form {
      background-color: #FFFFFF;
      padding: 8px;
      margin-top: 8px;
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
      cursor: pointer;
      display: inline-block;
      padding: 8px 8px 0;
    }
    </style>
    <div class="showForm">Add a card</div>
    <form style="display: none">
      <input type="text" placeholder="Title" name="title" required><br>
      <textarea placeholder="Description" name="description"></textarea><br>
      <input type="hidden" value="${addCard.columnId}" name="columnId">
      <input type="button" value="Cancel"> <input type="submit" value="Add">
    </form>`;
  }
  
  toggleForm() { // Toggle display of form and 'Add add card' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";
    const showButton = this.root.querySelector('.showForm');
    showButton.style.display = showButton.style.display === "none" ? "block" : "none";
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
      let cardsContainer = this.parentNode.querySelector('.cards-container');
      cardsContainer.appendChild(cardElement);
      // let parentDiv = this.parentNode;
      // parentDiv.insertBefore(cardElement, this);
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
