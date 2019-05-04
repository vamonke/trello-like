import Card from "./card.js";

describe("Card", () => {
  let card;
  const mock = {
    id: 1,
    title: "Card 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    columnId: 1
  };

  beforeEach(function() {
    card = document.createElement(Card.tag);
    card.card = mock;
  });

  describe("Form", () => {  
    it("should have an input for id", () => {
      const idInput = card.root.querySelector('input[name="id"]');
      expect(idInput).not.toBeNull();
      expect(idInput.value).toEqual(mock.id + '');
    });

    it("should have a input for title", () => {
      const titleInput = card.root.querySelector('input[name="title"]');
      expect(titleInput).not.toBeNull();
      expect(titleInput.value).toEqual(mock.title);
    });
      
    it("should have a textarea for description", () => {
      const descriptionInput = card.root.querySelector('textarea');
      expect(descriptionInput).not.toBeNull();
      expect(descriptionInput.value).toEqual(mock.description + '');
    });
      
    it("should have a hidden input for columnId", () => {      
      const columnIdInput = card.root.querySelector('input[name="columnId"]');
      expect(columnIdInput).not.toBeNull();
      expect(columnIdInput.value).toEqual(mock.columnId + '');
    });
    
    it("should send a PUT request on submit", () => {
      // Stub fetch() API
      spyOn(window, 'fetch').and.returnValue({
        ok: true,
        json: () => mock,
      });
      card.connectedCallback(); // Add eventListeners
      
      const form = card.root.querySelector('form');
      const submit = new Event('submit');
      form.dispatchEvent(submit);

      expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/cards/' + mock.id,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: mock.title,
            description: mock.description,
            columnId: mock.columnId
          })
        }
      );
    });
  });

  it("should have title and description", () => {
    const h3 = card.root.querySelector('h3');
    expect(h3.innerHTML).toBe(mock.title);
    
    const p = card.root.querySelector('p');
    expect(p.innerHTML).toBe(mock.description);
  });

  it("should have edit and cancel buttons that toggle display of form", () => {
    card.connectedCallback(); // Add eventListeners
    const form = card.root.querySelector('form');
    const article = card.root.querySelector('article');
    const editButton = card.root.querySelector('.editButton');
    const cancelButton = card.root.querySelector('input[value="Cancel"]');
    
    expect(editButton).not.toBeNull();
    expect(cancelButton).not.toBeNull();
    expect(form.style.display).toBe('none');

    editButton.click();
    expect(article.style.display).toBe('none');
    expect(form.style.display).toBe('block');

    cancelButton.click();
    expect(article.style.display).toBe('block');
    expect(form.style.display).toBe('none');
  });

  it("should send a DELETE request on clicking delete", () => {
    spyOn(window, 'fetch'); // Stub fetch() API
    card.connectedCallback(); // Add eventListeners

    const deleteButton = card.root.querySelector('.deleteButton');
    expect(deleteButton).not.toBeNull();
    deleteButton.click();
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/cards/' + mock.id,
      { method: 'DELETE' }
    );
  });
});