describe('Todos', () => {
  beforeEach(() => {
    // mock api data
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3004/todos',
      },
      {
        body: [
          { id: 1, text: 'first todo', isCompleted: true },
          { id: 2, text: 'second todo', isCompleted: false },
          { id: 3, text: 'third todo', isCompleted: false },
        ],
      }
    )
      .intercept(
        /* mock create new todo */
        { method: 'POST', url: 'http://localhost:3004/todos' },
        { body: { id: 4, text: 'foo', isCompleted: false } }
      )
      .intercept(
        /* mock delete todo */
        { method: 'DELETE', url: 'http://localhost:3004/todos/1' },
        { body: {} }
      )
      .intercept(
        /* mock update isCompleted */
        { method: 'PUT', url: 'http://localhost:3004/todos/1' },
        { body: { id: 1, text: 'first todo', isCompleted: false } }
      )
      .visit('/')
  })

  it('visits the initial project page', () => {
    cy.contains('todos')
  })

  it('renders 3 todos', () => {
    cy.get('[data-cy="todo"').should('have.length', 3)
    cy.get('[data-cy="todo"').eq(0).should('contain.text', 'first todo')
    cy.get('[data-cy="todo"').eq(1).should('contain.text', 'second todo')
    cy.get('[data-cy="todo"').eq(2).should('contain.text', 'third todo')
    cy.get('[data-cy="todoCheckbox"').eq(0).should('be.checked')
  })

  it('renders footer', () => {
    cy.get('[data-cy="todoCount"').eq(0).should('contain.text', '2 items left')
    cy.get('[data-cy="filterLink"').eq(0).should('contain.text', 'All').should('have.class', 'selected')
    cy.get('[data-cy="filterLink"').eq(1).should('contain.text', 'Active')
    cy.get('[data-cy="filterLink"').eq(2).should('contain.text', 'Completed')
  })

  it('can change filter', () => {
    cy.get('[data-cy="filterLink"').eq(1).click()
    cy.get('[data-cy="filterLink"').eq(1).should('have.class', 'selected')
  })

  it('can add new todo', () => {
    cy.get('[data-cy="newTodoInput"').type('foo{enter}')
    cy.get('[data-cy="todoCount"').eq(0).should('contain.text', '3 items left')
    cy.get('[data-cy="todo"').eq(3).should('contain.text', 'foo')
  })

  it('can remove a todo', () => {
    cy.get('[data-cy="destroy"').eq(0).click({ force: true }) // force: true - click on hidden button
    cy.get('[data-cy="todo"').should('have.length', 2)
  })

  it('can toggle a todo', () => {
    cy.get('[data-cy="todoCheckbox"').eq(0).click()
    cy.get('[data-cy="todoCheckbox"').eq(0).should('not.be.checked')
  })

  it('can toggle all todos', () => {
    cy.intercept(
      { method: 'PUT', url: 'http://localhost:3004/todos/*' },
      { body: { id: 1, text: 'foo', isCompleted: true } }
    )
    cy.get('[data-cy="toggleAll"').click()
    cy.get('[data-cy="todoCheckbox"').eq(0).should('be.checked')
    cy.get('[data-cy="todoCheckbox"').eq(1).should('be.checked')
    cy.get('[data-cy="todoCheckbox"').eq(2).should('be.checked')
  })

  it('can update todo text', () => {
    cy.intercept(
      { method: 'PUT', url: 'http://localhost:3004/todos/1' },
      { body: { id: 1, text: 'bar', isCompleted: true } }
    )
    cy.get('[data-cy="todoLabel"').eq(0).dblclick()
    cy.get('[data-cy="todoEdit"').type('bar{enter}')
    cy.get('[data-cy="todoLabel"').eq(0).should('contain.text', 'bar')
  })
})
