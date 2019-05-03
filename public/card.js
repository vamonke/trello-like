class Card extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set card(card) {
    // Bind methods
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editCard = this.editCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    this.root.innerHTML = `
    <style>
    article {
      background-color: #FFFFFF;
      padding: 8px;
      margin-top: 8px;
      overflow: auto;
    }
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
    .deleteButton, .editButton {
      cursor: pointer;
      display: inline-block;
      margin-left: 10px;
      float: right;
    }
    </style>
    <article>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <div class="editButton">Edit</div>
      <div class="deleteButton">Delete</div>
    </article>
    <form style="display: none">
      <input type="hidden" value="${card.id}" name="id">
      <input type="text" value=${card.title} name="title" placeholder="Title"  required><br>
      <textarea name="description" placeholder="Description">${card.description}</textarea><br>
      <input type="hidden" value="${card.columnId}" name="columnId">
      <input type="button" value="Cancel"> <input type="submit" value="Save">
    </form>`;
  }

  async editCard(id, title, description, columnId) { // Edit card
    // PUT edited card to server
    const res = await fetch('http://localhost:3000/cards/' + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, columnId })
    });
    if (res.ok) {
      // Update card element
      const updatedCard = await res.json();
      this.root.querySelector('h3').innerHTML = updatedCard.title;
      this.root.querySelector('p').innerHTML = updatedCard.description;
    } else {
      alert("Error ocurred");
    }
  }

  toggleForm() { // Toggle display of form and 'Add new card' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";
    const card = this.root.querySelector('article');
    card.style.display = card.style.display === "none" ? "block" : "none";
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();
    // Get new card details
    const id = this.root.querySelector('input[name="id"]').value;
    const columnId = this.root.querySelector('input[name="columnId"]').value;
    const titleInput = this.root.querySelector('input[name="title"]');
    const title = titleInput.value;
    const descriptionInput = this.root.querySelector('textarea[name="description"]');
    const description = descriptionInput.value;

    await this.editCard(id, title, description, Number(columnId));
    
    // Reset form
    this.toggleForm();
    titleInput.value = '';
    descriptionInput.value = '';
  }

  async deleteCard(e) {
    e.preventDefault();
    const id = this.root.querySelector('input[name="id"]').value;

    // DELETE card from server
    const res = await fetch('http://localhost:3000/cards/' + id, { method: 'DELETE' });

    if (res.ok) {
      this.style.display = "none"; // Hide card element
    } else {
      alert("Error ocurred");
    }
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    // Toggle form listener
    const editButton = this.root.querySelector('.editButton');
    const cancelButton = this.root.querySelector('input[value="Cancel"]');
    editButton.addEventListener('click', this.toggleForm, false);
    cancelButton.addEventListener('click', this.toggleForm, false);

    // Submit form listener
    const form = this.root.querySelector('form');
    form.addEventListener('submit', this.handleSubmit, false);

    // Delete card listener
    const deleteButton = this.root.querySelector('.deleteButton');
    deleteButton.addEventListener('click', this.deleteCard, false);
  }
}

customElements.define("card-element", Card);
