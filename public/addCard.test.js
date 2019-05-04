import AddCard from "./addCard.js";

describe("AddCard", () => {
  let addCard;
  const mock = { columnId: 1 };

  beforeEach(function() {
    addCard = document.createElement(AddCard.tag);
    addCard.addCard = mock;
  });

  describe("Form", () => {  
    it("should have an input for title", () => {
      const titleInput = addCard.root.querySelector('input[name="title"]');
      expect(titleInput).not.toBeNull();
    });

    it("should have a textarea for description", () => {
      const descriptionInput = addCard.root.querySelector('textarea');
      expect(descriptionInput).not.toBeNull();
    });
      
    it("should have a hidden input for columnId", () => {      
      const columnIdInput = addCard.root.querySelector('input[name="columnId"]');
      expect(columnIdInput).not.toBeNull();
      expect(columnIdInput.value).toEqual(mock.columnId + '');
    });
    
    it("should send a PUT request on submit", () => {
      const title = "Card 1";
      const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      const columnId = mock.columnId + '';

      let titleInput = addCard.root.querySelector('input[name="title"]');
      titleInput.value = title;

      let descriptionInput = addCard.root.querySelector('textarea');
      descriptionInput.value = description;

      // Stub fetch() API
      spyOn(window, 'fetch').and.returnValue({
        ok: true,
        json: () => addCard,
      });
      addCard.connectedCallback(); // Add eventListeners
      
      const form = addCard.root.querySelector('form');
      const submit = new Event('submit');
      form.dispatchEvent(submit);

      expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/cards',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description, columnId })
        }
      );
    });
  });

  it("should have edit and cancel buttons that toggle display of form", () => {
    addCard.connectedCallback(); // Add eventListeners
    const form = addCard.root.querySelector('form');
    const showForm = addCard.root.querySelector('.showForm');
    const cancelButton = addCard.root.querySelector('input[value="Cancel"]');
    
    expect(showForm).not.toBeNull();
    expect(cancelButton).not.toBeNull();
    expect(form.style.display).toBe('none');

    showForm.click();
    expect(showForm.style.display).toBe('none');
    expect(form.style.display).toBe('block');

    cancelButton.click();
    expect(showForm.style.display).toBe('block');
    expect(form.style.display).toBe('none');
  });
});