export default class columnTitle extends HTMLElement {
  static get tag() {
    return "column-title";
  }
  get title() {
    return this.getAttribute('title');
  }
  set title(title) {
    const oldTitle = this.getAttribute('title');
    const parentColumn = document.querySelector(`column-element[title="${oldTitle}"]`);
    parentColumn.setAttribute('title', title);
    this.setAttribute('title', title);
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set columnTitle(column) {
    // Bind methods
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    
    this.root.innerHTML = `
      <style>
        @import "icons.css";
        @import "form.css";
        .title {
          overflow: auto;
          padding: 5px 10px 0 5px;
        }
        h3 {
          margin: 0;
          float: left;
        }
        input[type="text"] {
          box-sizing: border-box;
          margin-bottom: 8px;
          width: 100%;
          max-width: 100%;
        }
        textarea {
          min-height: 80px;
        }
        .buttons {
          float: right;
        }
      </style>
      <div class="title">
        <h3>${column.title}</h3>
        <div class="buttons">
          <span class="deleteButton"></span>
          <span class="editButton"></span>
        </div>
      </div>
      <form style="display: none">
        <input type="text" value="${column.title}" placeholder="Title" name="title" required><br>
        <input type="hidden" value="${column.id}" name="id">
        <input type="button" value="Cancel"> <input type="submit" value="Save">
      </form>
      `;
  }
  
  toggleForm() { // Toggle display of form and 'Edit' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";    
    
    const title = this.root.querySelector('.title');
    title.style.display = title.style.display === "none" ? "block" : "none";

    const titleInput = this.root.querySelector('input[name="title"]');
    titleInput.focus();    
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();
    // Get new column title
    const titleInput = this.root.querySelector('input[name="title"]');
    const newTitle = titleInput.value;
    if (newTitle !== this.title) {
      const allColumns = document.querySelectorAll('column-element');
      const allColumnTitles = Array.from(allColumns).map(column => column.title);
      if (allColumnTitles.includes(newTitle)) {
        return alert("There is another column with the same title!");
      }

      const id = this.root.querySelector('input[name="id"]').value;

      // PUT editted column to server
      const res = await fetch('http://localhost:3000/columns/' + id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (res.ok) {
        // Update column element
        const createdColumn = await res.json();
        this.root.querySelector('h3').innerHTML = createdColumn.title;
        this.title = newTitle;
        titleInput.value = newTitle;
      } else {
        alert("Error ocurred");
      }
    }
    
    // Reset form
    this.toggleForm();
  }

  async deleteColumn(e) {
    e.preventDefault();
    const id = this.root.querySelector('input[name="id"]').value;

    // DELETE card from server
    const res = await fetch('http://localhost:3000/columns/' + id, { method: 'DELETE' });

    if (res.ok) {
      // Hide column element
      let columnElement = this.parentNode;
      columnElement.style.display = "none";
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
    deleteButton.addEventListener('click', this.deleteColumn, false);
  }
}

customElements.define(columnTitle.tag, columnTitle);
