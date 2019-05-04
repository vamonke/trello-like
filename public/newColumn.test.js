import NewColumn from "./newColumn.js";

describe("NewColumn", () => {
  let newColumn;

  beforeEach(function() {
    newColumn = document.createElement(NewColumn.tag);
    newColumn.newColumn = {};
  });

  describe("Form", () => {  
    it("should have an input for title", () => {
      const titleInput = newColumn.root.querySelector('input[name="title"]');
      expect(titleInput).not.toBeNull();
    });
    
    it("should send a PUT request on submit", () => {
      const title = "Column 1";
      let titleInput = newColumn.root.querySelector('input[name="title"]');
      titleInput.value = title;

      // Stub fetch() API
      spyOn(window, 'fetch').and.returnValue({
        ok: true,
        json: () => newColumn,
      });
      newColumn.connectedCallback(); // Add eventListeners
      
      const form = newColumn.root.querySelector('form');
      const submit = new Event('submit');
      form.dispatchEvent(submit);

      expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/columns',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        }
      );
    });
  });

  it("should have edit and cancel buttons that toggle display of form", () => {
    newColumn.connectedCallback(); // Add eventListeners
    const form = newColumn.root.querySelector('form');
    const showForm = newColumn.root.querySelector('.showForm');
    const cancelButton = newColumn.root.querySelector('input[value="Cancel"]');
    
    expect(showForm).not.toBeNull();
    expect(cancelButton).not.toBeNull();
    expect(form.style.display).toBe('none');

    showForm.click();
    expect(showForm.style.display).toBe('none');
    expect(form.style.display).toBe('inline-block');

    cancelButton.click();
    expect(showForm.style.display).toBe('inline-block');
    expect(form.style.display).toBe('none');
  });
});