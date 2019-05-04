import Column from "./column.js";

describe("Column", () => {
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
    column = document.createElement(Column.tag);
    column.column = mock;
  });

  it("should have <column-title>", () => {
    const columnTitle = column.root.querySelector('column-title');
    expect(columnTitle).not.toBeNull();
  });

  it("should have multiple cards", () => {
    const cards = column.root.querySelectorAll('card-element');
    expect(cards.length).toEqual(3);
  });

  it("should have <add-card>", () => {
    const addCard = column.root.querySelector('add-card');
    expect(addCard).not.toBeNull();
  });
});