import Search from "./search.js";
import Column from "./column.js";

describe("Search", () => {
  let search;
  let column;
  const mock = {
    id: 1,
    title: "Column 1",
    cards: [
      {
        id: 1,
        title: "Card 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        columnId: 1
      },
      {
        id: 2,
        title: "Card 2",
        description: "Quisque et pellentesque sem.",
        columnId: 1
      },
      {
        id: 3,
        title: "Card 3",
        description: "Nulla porttitor erat a sollicitudin volutpat.",
        columnId: 1
      }
    ]
  };

  beforeEach(function() {
    document.body.innerHTML = '';
    search = document.createElement(Search.tag);
    search.search = {};
    document.body.appendChild(search);

    column = document.createElement(Column.tag);
    column.column = mock;
    document.body.appendChild(column);
  });

  describe("Form", () => {
    it("should contain an input and a button", () => {
      const form = search.root.querySelector('form');
      expect(form).not.toBeNull();

      const searchInput = form.querySelector('input[name="keywords"]');
      expect(searchInput).not.toBeNull();

      const searchButton = form.querySelector('input[value="Search"]');
      expect(searchButton).not.toBeNull();
    });

    it("should show all cards when searching with an empty field", () => {
      const column = document.querySelector('column-element');
      const cards = column.root.querySelectorAll('card-element');
      expect(cards.length).toEqual(3);
      search.connectedCallback(); // Add eventListeners

      const form = search.root.querySelector('form');
      const submit = new Event('submit');
      form.dispatchEvent(submit);
      expect(cards.length).toEqual(3);
    });
    
    it("should filter cards based on keywords", () => {
      search.connectedCallback(); // Add eventListeners

      let column = document.querySelector('column-element');
      let cards = column.root.querySelectorAll('card-element');
      expect(cards.length).toBe(3);

      const form = search.root.querySelector('form');
      const searchInput = form.querySelector('input[name="keywords"]');
      
      // search 'abc'
      searchInput.value = 'abc';
      const submit = new Event('submit');
      form.dispatchEvent(submit);
      column = document.querySelector('column-element');
      cards = column.root.querySelectorAll('card-element');
      // expect no results i.e. all cards hidden
      cards = Array.from(cards).filter(card => card.style.display == 'none');
      expect(cards.length).toBe(3);

      // search 'lorem sem'
      searchInput.value = 'lorem sem';
      form.dispatchEvent(submit);
      column = document.querySelector('column-element');
      cards = column.root.querySelectorAll('card-element');
      // expect 1st and 2nd cards to be shown
      let cardsDisplay = Array.from(cards).map(card => card.style.display);
      expect(cardsDisplay).toEqual(['block', 'block', 'none']);
    });
  });
});