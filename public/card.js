class Card extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }
  set card(card) {
    this.root.innerHTML = `
    <style>
    article {
      background-color: #FFFFFF;
      padding: 8px;
      margin-top: 8px;
    }
    </style>
    <article>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
    </article>
    </a>`;
  }
}

customElements.define("card-element", Card);
