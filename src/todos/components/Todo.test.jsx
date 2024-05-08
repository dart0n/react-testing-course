import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { TodosContext } from '../contexts/todos'
import Todo from './Todo'

describe('Todo', () => {
  const mockDispatch = vi.fn()
  const mockUpdateTodo = vi.fn()
  const mockRemoveTodo = vi.fn()

  it('renders default state', () => {
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={false} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const todo = screen.getByTestId('todo')
    const edit = screen.queryByTestId('edit')
    const label = screen.getByTestId('label')
    expect(todo).not.toHaveClass('completed')
    expect(todo).not.toHaveClass('editing')
    expect(edit).not.toBeInTheDocument()
    expect(label).toHaveTextContent(todoEntity.text)
  })

  it('should toggle isCompleted', async () => {
    const user = userEvent.setup()
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={false} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const toggle = screen.getByTestId('toggle')
    await user.click(toggle)
    expect(mockUpdateTodo).toHaveBeenCalledWith(todoEntity.id, { text: todoEntity.text, isCompleted: true })
  })

  it('should remove todo', async () => {
    const user = userEvent.setup()
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={false} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const destroy = screen.getByTestId('destroy')
    await user.click(destroy)
    expect(mockRemoveTodo).toHaveBeenCalledWith(todoEntity.id)
  })

  it('should activate editing mode', async () => {
    const user = userEvent.setup()
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={false} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const label = screen.getByTestId('label')
    await user.dblClick(label)
    expect(mockSetEditingId).toHaveBeenCalledWith(todoEntity.id)
  })

  it('should update todo', async () => {
    const user = userEvent.setup()
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={true} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const edit = screen.getByTestId('edit')
    await user.clear(edit)
    await user.type(edit, 'bar{enter}')
    expect(mockUpdateTodo).toHaveBeenCalledWith(todoEntity.id, { text: 'bar', isCompleted: false })
  })


  it('should focus on the input after editing activation', () => {
    const mockSetEditingId = vi.fn()
    const todoEntity = { id: '1', text: 'foo', isCompleted: false }
    render(
      <TodosContext.Provider value={[{}, mockDispatch, { updateTodo: mockUpdateTodo, removeTodo: mockRemoveTodo }]}>
        <Todo todo={todoEntity} isEditing={true} setEditingId={mockSetEditingId} />
      </TodosContext.Provider>
    )
    const edit = screen.getByTestId('edit')
    expect(edit.matches(':focus')).toEqual(true)
  })
})
