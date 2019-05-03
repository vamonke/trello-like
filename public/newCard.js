class NewCard extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set newCard(newCard) {
    // Bind methods
    this.addCard = newCard.addCard;
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
      <input type="hidden" value="${newCard.columnId}" name="columnId">
      <input type="button" value="Cancel"> <input type="submit" value="Add">
    </form>`;
  }
  
  toggleForm() { // Toggle display of form and 'Add new card' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";
    const showButton = this.root.querySelector('.showForm');
    showButton.style.display = showButton.style.display === "none" ? "block" : "none";
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();

    // Get new card details
    const titleInput = this.root.querySelector('input[name="title"]');
    const descriptionInput = this.root.querySelector('textarea[name="description"]');
    const columnIdInput = this.root.querySelector('input[name="columnId"]');
    const title = titleInput.value;
    const description = descriptionInput.value;
    const columnId = columnIdInput.value;

    await this.addCard(title, description, columnId);
    
    // Reset form
    this.toggleForm();
    titleInput.value = '';
    descriptionInput.value = '';
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    const showButton = this.root.querySelector('.showForm');
    const cancelButton = this.root.querySelector('input[value="Cancel"]');
    showButton.addEventListener('click', this.toggleForm, false);
    cancelButton.addEventListener('click', this.toggleForm, false);

    const form = this.root.querySelector('form');
    form.addEventListener('submit', this.handleSubmit, false);
  }
}

customElements.define("new-card", NewCard);
