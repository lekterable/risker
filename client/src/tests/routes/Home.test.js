import React from 'react'
import { shallow } from 'enzyme'
import { Home } from '../../routes/Home'

describe('Home', () => {
  const props = (props, socketProps) => ({
    socket: {
      id: '',
      emit: () => {},
      on: () => {},
      ...socketProps
    },
    ...props
  })

  it('should match snapshot', () => {
    const wrapper = shallow(<Home {...props()} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should display player id correctly', () => {
    const wrapper = shallow(<Home {...props({}, { id: 'player-id' })} />)

    expect(wrapper.find('input.player-id').prop('value')).toEqual('player-id')
  })

  it('should call `emit` on mount', () => {
    const emitSpy = jest.fn()

    const wrapper = shallow(<Home {...props({}, { emit: emitSpy })} />)

    expect(emitSpy.mock.calls.length).toEqual(1)
  })

  it('should call `on` on mount', () => {
    const onSpy = jest.fn()

    const wrapper = shallow(<Home {...props({}, { on: onSpy })} />)

    expect(onSpy.mock.calls.length).toEqual(3)
    expect(onSpy.mock.calls[0][0]).toEqual('start-game')
    expect(onSpy.mock.calls[1][0]).toEqual('info')
    expect(onSpy.mock.calls[2][0]).toEqual('invitation')
  })

  it('should set opponent id on input', () => {
    const wrapper = shallow(<Home {...props()} />)
    wrapper.find('input.opponent-id').simulate('change', {
      target: {
        value: 'opponent'
      }
    })

    expect(wrapper.state('opponent')).toEqual('opponent')
  })

  it('should not call `invite` on button click if no opponent id provided', () => {
    const inviteSpy = jest.fn()

    const wrapper = shallow(<Home {...props({}, { id: 'player-id' })} />)
    wrapper.instance().invite = inviteSpy
    wrapper.find('button').simulate('click')

    expect(inviteSpy.mock.calls.length).toEqual(0)
  })

  it('should not call `invite` on button click if id belongs to the player', () => {
    const inviteSpy = jest.fn()

    const wrapper = shallow(<Home {...props({}, { id: 'player-id' })} />)
    wrapper.instance().invite = inviteSpy
    wrapper.setState({ opponent: 'player-id' })
    wrapper.find('button').simulate('click')

    expect(inviteSpy.mock.calls.length).toEqual(0)
  })

  it('should call `invite` on button click', () => {
    const inviteSpy = jest.fn()

    const wrapper = shallow(<Home {...props({}, { id: 'player-id' })} />)
    wrapper.instance().invite = inviteSpy
    wrapper.setState({ opponent: 'opponent-id' })
    wrapper.find('button').simulate('click')

    expect(inviteSpy.mock.calls.length).toEqual(1)
  })

  it('should render player list correctly', () => {
    const players = ['opponent-1', 'opponent-2', 'opponent-3']

    const wrapper = shallow(<Home {...props()} />)

    expect(wrapper.find('li.list-group-item').length).toEqual(0)

    wrapper.setState({ players })

    expect(wrapper.find('li.list-group-item').length).toEqual(3)
  })

  it('should set opponent id on click', () => {
    const players = ['opponent-1', 'opponent-2', 'opponent-3']

    const wrapper = shallow(<Home {...props()} />)
    wrapper.setState({ players })
    wrapper
      .find('li.list-group-item')
      .at(0)
      .simulate('click')

    expect(wrapper.state('opponent')).toEqual('opponent-1')
  })
})
