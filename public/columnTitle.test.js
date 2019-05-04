import ColumnTitle from "./columnTitle.js";

describe("ColumnTitle", () => {
  let columnTitle;
  const mock = {
    id: 1,
    title: "Column 1"
  };

  beforeEach(function() {
    columnTitle = document.createElement(ColumnTitle.tag);
    columnTitle.columnTitle = mock;
  });

  describe("Form", () => {  
    it("should have title and id inputs", () => {
      const titleInput = columnTitle.root.querySelector('input[name="title"]');
      expect(titleInput).not.toBeNull();
      expect(titleInput.value).toEqual(mock.title);

      const idInput = columnTitle.root.querySelector('input[name="id"]');
      expect(idInput).not.toBeNull();
      expect(idInput.value).toEqual(mock.id + '');
    });
    
    it("should send a PUT request on submit", () => {
      spyOn(window, 'fetch').and.returnValue({
        ok: true,
        json: ()=>({ title: mock.title }),
      });
      columnTitle.connectedCallback();
      
      const form = columnTitle.root.querySelector('form');
      const submit = new Event('submit');
      form.dispatchEvent(submit);

      expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/columns/' + mock.id,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: '{"title":"Column 1"}'
        }
      );
    });
  });

  it("should have title in <h3>", () => {
    const h3 = columnTitle.root.querySelector('h3');
    expect(h3.innerHTML).toBe(mock.title);
  });

  it("should have edit and cancel buttons that toggle display of form", () => {
    columnTitle.connectedCallback();
    const form = columnTitle.root.querySelector('form');
    const title = columnTitle.root.querySelector('.title');
    const editButton = columnTitle.root.querySelector('.edit');
    const cancelButton = columnTitle.root.querySelector('input[value="Cancel"]');
    
    expect(editButton).not.toBeNull();
    expect(cancelButton).not.toBeNull();
    expect(form.style.display).toBe('none');

    editButton.click();
    expect(form.style.display).toBe('block');
    expect(title.style.display).toBe('none');

    cancelButton.click();
    expect(title.style.display).toBe('inline-block');
    expect(form.style.display).toBe('none');
  });

  it("should send a DELETE request on clicking delete", () => {
    spyOn(window, 'fetch');
    columnTitle.connectedCallback();
    const deleteButton = columnTitle.root.querySelector('.delete');
    expect(deleteButton).not.toBeNull();
    deleteButton.click();
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:3000/columns/' + mock.id, { method: 'DELETE' });
  });
});