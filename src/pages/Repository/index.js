import React, { Component } from 'react';
import api from "../../services/api"

// import { Container } from './styles';

export default class Repository extends Component {
  //armazenando data 
  state = {
    repository: {},
    issues: []
  }
  
  
  //pegando data
  async componentDidMount() {
    const { match } = this.props

    const repoName = decodeURIComponent(match.params.repository)

    const [repository, issues]= await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        }
      }),
    ])

    //setando data
    this.setState({
      repository: repository.data,
      issues: issues.data
    })
    
    console.log(repository)
    console.log(issues)

  }
  
  render(){
    return <h1> Repository</h1>;
  }
}

