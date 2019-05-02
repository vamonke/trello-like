class Column extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set column(column) {
    console.log(this.root);
    this.root.innerHTML = `
    <style>
    section {
      white-space: initial;
      background-color: #DDDDDD;
      display: inline-block;
      vertical-align: top;
      width: 400px;
      padding: 8px;
    }
    </style>
    <section>
      <h3>${column.title}</h3>
    </section>`;

    // Append cards to section
    column.cards.forEach(card => {
      const el = document.createElement('card-element');
      el.card = card;
      this.root.querySelector('section').appendChild(el);
    })
  }
}

customElements.define("column-element", Column);