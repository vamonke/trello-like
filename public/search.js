export default class Search extends HTMLElement {
  static get tag() {
    return "search-bar";
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set search(search) {
    // Bind methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);

    this.root.innerHTML = `
      <style>
        @import "form.css";
        input[type="text"] {
          width: 300px;
        }
        input[value="Cancel"] {
          color: white;
        }
      </style>
      <form>
        <input type="text" name="keywords" placeholder="Search..">
        <input type="submit" value="Search">
        <input type="button" value="Cancel" style="display: none;">
      </form>
    `;
  }

  cancel(e) {
    if (e) e.preventDefault();
    const allColumns = document.querySelectorAll('column-element');
    allColumns.forEach(column => {
      const cards = column.root.querySelectorAll('card-element');
      cards.forEach(card => {
        card.style.display = 'block';
      });
    });
    // Reset form
    const searchBar = this.root.querySelector('input[name="keywords"]');
    searchBar.value = "";
    const cancel = this.root.querySelector('input[value="Cancel"]');
    cancel.style.display = 'none';
  }

  handleSubmit(e) { // On submission of form
    e.preventDefault();
    // Get keywords
    const searchBar = this.root.querySelector('input[name="keywords"]');
    const keywords = searchBar.value.toLowerCase();
    if (keywords === "") {
      this.cancel();
      return null;
    }
    
    // Filter cards by keywords in title and description
    const regex = new RegExp(keywords.split(' ').join("|"));
    const allColumns = document.querySelectorAll('column-element');
    allColumns.forEach(column => {
      const cards = column.root.querySelectorAll('card-element');
      cards.forEach(card => {
        const title = card.root.querySelector('h4').innerHTML.toLowerCase();
        const description = card.root.querySelector('p').innerHTML.toLowerCase();
        const found = regex.test(title) || regex.test(description);
        // console.log(found);
        card.style.display = found ? 'block' : 'none' ;
      });
    });
    
    // Show cancel button
    const cancel = this.root.querySelector('input[value="Cancel"]');
    cancel.style.display = 'inline-block';
  }

  connectedCallback() { // Add event listeners once components are connected to DOM
    // Submit form listener
    const form = this.root.querySelector('form');
    form.addEventListener('submit', this.handleSubmit, false);

    // Cancel search listener
    const cancel = this.root.querySelector('input[value="Cancel"]');
    cancel.addEventListener('click', this.cancel, false);
  }
}

customElements.define(Search.tag, Search);