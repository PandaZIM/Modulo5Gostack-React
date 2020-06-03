import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import api from "../../services/api"

import Container from '../../components/Container'
import { Owner, IssueList } from './styles'


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
  }
  
  render(){
    const { repository, issues } = this.state
    let owner = repository.owner
    return (
      <Container>
          <Owner>
            <Link to="/">Voltar aos reposítorios</Link>
            
            {owner ? <img src={owner.avatar_url} alt="Avatar"/> : null}
            <h1>{repository.name}</h1>
            <p>{repository.description}</p>
          </Owner>

          <IssueList>
            {issues.map(issue => (
              <li key={String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login}></img>
                <div>
                  <strong>
                    <a href={issue.html_url}>{issue.title}</a>
                    {issue.labels.map(label => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))}  
          </IssueList> 
      </Container>
    );
  }
}

