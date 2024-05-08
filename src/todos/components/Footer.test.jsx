import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { TodosContext } from '../contexts/todos'
import Footer from './Footer'

const customRender = (ui, providerProps) => {
  return render(
    <TodosContext.Provider value={providerProps}>{ui}</TodosContext.Provider>
  )
}

describe('Footer', () => {
  const mockDispatch = vi.fn()

  describe('component visibility', () => {
    it('should be hidden with no todos', () => {
      const state = { todos: [], filter: 'all' }
      //// without customRender
      // render(
      //   <TodosContext.Provider value={[state, mockDispatch, {}]}>
      //     <Footer />
      //   </TodosContext.Provider>
      // )
      customRender(<Footer />, [state, mockDispatch, {}])
      expect(screen.getByTestId('footer')).toHaveClass('hidden')
    })

    it('should be visible with todos', () => {
      const state = { todos: [{ id: '1', text: 'foo', isCompleted: false }], filter: 'all' }
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      )
      expect(screen.getByTestId('footer')).not.toHaveClass('hidden')
    })
  })

  describe('todos counters', () => {
    it('renders a counter for 1 todo', () => {
      const state = { todos: [{ id: '1', text: 'foo', isCompleted: false }], filter: 'all' }
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      )
      expect(screen.getByTestId('todoCount')).toHaveTextContent('1 item left')
    })

    it('renders a counter for 2 todos', () => {
      const state = {
        todos: [
          { id: '1', text: 'foo', isCompleted: false },
          { id: '2', text: 'bar', isCompleted: false }
        ],
        filter: 'all'
      }
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      )
      expect(screen.getByTestId('todoCount')).toHaveTextContent('2 items left')
    })
  })

  describe('filters', () => {
    it('highlights default filter', () => {
      const state = { todos: [{ id: '1', text: 'foo', isCompleted: false }], filter: 'all' }
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      )
      const filterLinks = screen.getAllByTestId('filterLink')
      expect(filterLinks[0]).toHaveClass('selected')
    })

    it('highlights changed filter', () => {
      const state = { todos: [{ id: '1', text: 'foo', isCompleted: false }], filter: 'active' }
      render(
        <TodosContext.Provider value={[state, mockDispatch, {}]}>
          <Footer />
        </TodosContext.Provider>
      )
      const filterLinks = screen.getAllByTestId('filterLink')
      expect(filterLinks[1]).toHaveClass('selected')
    })

    it('changes a filter by click', async () => {
      const mockChangeFilter = vi.fn()
      const user = userEvent.setup()
      const state = { todos: [{ id: '1', text: 'foo', isCompleted: false }], filter: 'active' }
      render(
        <TodosContext.Provider value={[state, mockDispatch, { changeFilter: mockChangeFilter }]}>
          <Footer />
        </TodosContext.Provider>
      )
      const filterLinks = screen.getAllByTestId('filterLink')
      await user.click(filterLinks[1])
      expect(mockChangeFilter).toHaveBeenCalledWith('active')
    })
  })
})
