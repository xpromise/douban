import React, {Component} from 'react'
import Layout from '../../layouts/default'
import {Menu} from 'antd'
import Content from './content'
import {request} from '../../lib'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      years: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: [],
      selectedKey: '0',
      collapsed: false
    }

  }

  componentDidMount () {
    this._getAllMovies()
  }

  _toggleCollapsed () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  _selectItem ({key}) {
    this.setState({
      selectedKey: key
    })
  }

  _getAllMovies () {
    request(window.__LOADING__)({
      method: 'GET',
      url: `/api/v0/movies?type=${this.state.type || ''}&year=${this.state.year || ''}`
    })
      .then(res => {
        this.setState({
          movies: res
        })
      })
      .catch(() => {
        this.setState({
          movies: []
        })
      })
  }

  _renderContent () {
    const {movies} = this.state

    if (!movies || !movies.length) {
      return null
    }

    return (
      <Content movies={movies} />
    )
  }

  render () {
    const {years, selectedKey} = this.state
    return (
      <Layout {...this.props}>
        <div className='flex-row full' >
          <Menu defaultSelectedKeys={[selectedKey]}
                mode='inline'
                style={{height: '100%', overflowY: 'scroll', maxWidth: 190}}
                onSelect={this._selectItem}
                className='align-self-start'
          >
            {
              years && years.length
                ? years.map((item, index) => {
                  <Menu.Item key={index}>
                    <a href={`/year/${item}`}>{item}年上映</a>
                  </Menu.Item>
                })
                : null
            }
          </Menu>

          <div className='flex-1 scroll-y align-self-start'>
            {this._renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}