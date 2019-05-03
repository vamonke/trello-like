class columnTitle extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set columnTitle(column) {
    // Bind methods
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.root.innerHTML = `
    <style>
    input[type="text"] {
      box-sizing: border-box;
      margin-bottom: 8px;
      width: 100%;
      max-width: 100%;
    }
    textarea {
      min-height: 80px;
    }
    h3, .edit {
      display: inline-block;
    }
    .edit {
      cursor: pointer;
      margin-left: 8px;
    }
    </style>
    <div class="title">
      <h3>${column.title}</h3>
      <span class="edit">Edit</span>
    </div>
    <form style="display: none">
      <input type="text" value="${column.title}" placeholder="Title" name="title" required><br>
      <input type="hidden" value="${column.id}" name="id">
      <input type="button" value="Cancel"> <input type="submit" value="Save">
    </form>`;
  }
  
  toggleForm() { // Toggle display of form and 'Edit' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "block" : "none";
    const showButton = this.root.querySelector('.title');
    showButton.style.display = showButton.style.display === "none" ? "inline-block" : "none";
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();
    // Get new column title
    const titleInput = this.root.querySelector('input[name="title"]');
    const title = titleInput.value;
    const id = this.root.querySelector('input[name="id"]').value;

    // PUT editted column to server
    const res = await fetch('http://localhost:3000/columns/' + id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (res.ok) {
      // Update column element
      const createdColumn = await res.json();
      this.root.querySelector('h3').innerHTML = createdColumn.title;
    } else {
      alert("Error ocurred");
    }
    
    // Reset form
    this.toggleForm();
    titleInput.value = title;
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    const showButton = this.root.querySelector('.edit');
    const cancelButton = this.root.querySelector('input[value="Cancel"]');
    showButton.addEventListener('click', this.toggleForm, false);
    cancelButton.addEventListener('click', this.toggleForm, false);

    const form = this.root.querySelector('form');
    form.addEventListener('submit', this.handleSubmit, false);
  }
}

customElements.define("column-title", columnTitle);
