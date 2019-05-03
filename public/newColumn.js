class NewColumn extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set newColumn(newColumn) {
    // Bind methods
    this.addColumn = newColumn.addColumn;
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.root.innerHTML = `
    <style>
    form, .showForm {
      vertical-align: top;
      white-space: initial;
      width: 300px;
    }
    form {
      background-color: #DDDDDD;
      padding: 8px;
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
    .showForm {
      background-color: #EEEEEE;
      display: inline-block;
      cursor: pointer;
      padding: 50px 20px;
      text-align: center;
    }
    </style>
    <div class="showForm">Add a column</div>
    <form style="display: none">
      <input type="text" placeholder="Title" name="title" required><br>
      <input type="hidden" value="${newColumn.columnId}" name="columnId">
      <input type="button" value="Cancel"> <input type="submit" value="Add">
    </form>`;
  }
  
  toggleForm() { // Toggle display of form and 'Add new column' button
    const form = this.root.querySelector('form');
    form.style.display = form.style.display === "none" ? "inline-block" : "none";
    const showButton = this.root.querySelector('.showForm');
    showButton.style.display = showButton.style.display === "none" ? "inline-block" : "none";
  }

  async handleSubmit(e) { // On submission of form
    e.preventDefault();
    // Get new column title
    const titleInput = this.root.querySelector('input[name="title"]');
    const title = titleInput.value;

    // POST new column to server
    const res = await fetch('http://localhost:3000/columns', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (res.ok) {
      // Append newly created column
      const createdColumn = await res.json();
      const columnElement = document.createElement('column-element');
      columnElement.column = createdColumn;
      let parentDiv = this.parentNode;
      parentDiv.insertBefore(columnElement, this);
    } else {
      alert("Error ocurred");
    }
    
    // Reset form
    this.toggleForm();
    titleInput.value = '';
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

customElements.define("new-column", NewColumn);
