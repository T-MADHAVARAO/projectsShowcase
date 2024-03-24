import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

class App extends Component {
  state = {activeCategory: categoriesList[0].id, projects: [], view: 'LOADING'}

  componentDidMount() {
    this.getResponse()
  }

  getResponse = async () => {
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const {projects} = data
      const updateData = projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({projects: updateData, view: 'SUCCESS'})
    } else {
      this.setState({view: 'FAILURE'})
    }
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getResponse)
  }

  onLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  onSuccessView = () => {
    const {activeCategory, projects} = this.state
    return (
      <div className="bottom-cont">
        <select onChange={this.changeCategory} value={activeCategory}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <ul>
          {projects.map(each => (
            <li key={each.id} className="item">
              <img src={each.imageUrl} className="item-img" alt={each.name} />
              <p>{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onRetry = () => {
    this.getResponse()
  }

  finalView = () => {
    const {view} = this.state
    switch (view) {
      case 'SUCCESS':
        return this.onSuccessView()

      case 'FAILURE':
        return (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
              alt="failure view"
              className="not-found"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={this.onRetry}>
              Retry
            </button>
          </div>
        )

      default:
        return this.onLoadingView()
    }
  }

  render() {
    return (
      <div className="bg">
        <Header />
        {this.finalView()}
      </div>
    )
  }
}

export default App
