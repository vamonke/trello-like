export default class Card extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  static get tag() {
    return "card-element";
  }
  get title() {
    return this.getAttribute('title');
  }
  set title(title) {
    this.setAttribute('title', title);
  }
  set card(card) {
    // Bind methods
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editCard = this.editCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    
    this.dragStart = this.dragStart.bind(this);
    this.props = card;

    this.root.innerHTML = `
    <style>
      @import "icons.css";
      @import "form.css";
      section {
        position: relative;
      }
      article, form {
        background-color: #FFFFFF;
        border-radius: 3px;
        padding: 12px;
        margin-top: 12px;
        
        -webkit-box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
        -moz-box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
        box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.25);
      }
      article {
        cursor: pointer;
        overflow: auto;
      }
      article:hover {
        background-color: #F2F2F2;
      }
      h4 { /* Make space for buttons */
        margin: 0 50px 0 0;
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
      .buttons {
        position: absolute;
        right: 10px;
        top: 10px;
        text-align: right;
      }
    </style>
    
    <section draggable="true">
      <article>
      <h4>${card.title}</h4>
      <p style="display: none">${card.description}</p>
      </article>
      <div class="buttons">
        <div class="deleteButton"></div>
        <div class="editButton"></div>
      </div>
      <form style="display: none">
      <input type="hidden" value="${card.id}" name="id">
      <input type="text" value="${card.title}" name="title" placeholder="Title" required><br>
      <textarea name="description" placeholder="Description">${card.description}</textarea><br>
      <input type="hidden" value="${card.columnId}" name="columnId">
      <input type="button" value="Cancel"> <input type="submit" value="Save">
      </form>
    </section>`;
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
      this.root.querySelector('h4').innerHTML = updatedCard.title;
      this.root.querySelector('p').innerHTML = updatedCard.description;
    } else {
      alert("Error ocurred");
    }
  }

  toggleForm() { // Toggle display of form and buttons
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";

    const card = this.root.querySelector('article');
    const buttons = this.root.querySelector('.buttons');
    card.style.display = card.style.display === "none" ? "block" : "none";
    buttons.style.display = buttons.style.display === "none" ? "block" : "none";
  }

  toggleDescription() { // Toggle display of description
    const description = this.root.querySelector('p');
    description.style.display = description.style.display === "none" ? "block" : "none";
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

    if (title !== this.title) {
      const allCards = this.parentNode.querySelectorAll('card-element');
      const allCardTitles = Array.from(allCards).map(card => card.title);
      if (allCardTitles.includes(title)) {
        return alert("There is another card with the same title!");
      }  
      await this.editCard(id, title, description, Number(columnId));
    }

    // Reset form
    this.toggleForm();
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

  dragStart(e) {
    // Add card details to the data transfer object
    const data = JSON.stringify(this.props);
    e.dataTransfer.setData('text/plain', data);
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

    // Toggle description listener
    const article = this.root.querySelector('article');
    article.addEventListener('click', this.toggleDescription, false);

    // Drag listener
    const section = this.root.querySelector('section');
    section.addEventListener('dragstart', this.dragStart, false);
  }
}

customElements.define(Card.tag, Card);