import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { render, screen } from '@testing-library/react'
import Tags from './Tags'
import axios from 'axios'

describe('Tags', () => {
  //// mock api call recommended by react testing library
  // const server = setupServer(
  //   http.get('http://localhost:3004/tags', () => {
  //     return HttpResponse.json([{ id: '1', name: 'bar' }])
  //   })
  // )
  // beforeAll(() => server.listen())
  // afterAll(() => server.close())
  // afterEach(() => server.resetHandlers())

  it('renders tags', async () => {
    // another way how to mock api response (not recommended by react testing library)
    const mockResponse = { data: [{ id: '1', name: 'bar' }] }
    vi.spyOn(axios, 'get').mockResolvedValue(mockResponse)

    render(<Tags />)
    const tags = await screen.findAllByTestId('tag')
    expect(tags).toHaveLength(1)
    expect(tags[0]).toHaveTextContent('bar')
  })
})
