import React from 'react'
import { shallow } from 'enzyme'
import Footer from '../../components/Footer'

describe('Footer', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Footer />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render passed copyright', () => {
    const wrapper = shallow(<Footer content="copyright" />)

    expect(wrapper.find('span').text()).toEqual('copyright')
  })
})
