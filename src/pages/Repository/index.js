import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import api from "../../services/api"

import Container from '../../components/Container'
import { Owner, IssueList, IssueFilter, PageActions } from './styles'


export default class Repository extends Component {
  
  //armazenando data 
  state = {
    repository: {},
    issues: [],
    //define os filtros que precisam existir
    filters: [
      { state: 'all', label: 'Todas', active: true},
      { state: 'open', label: 'Abertas', active: false},
      { state: 'closed', label: 'Fechadas', active: false},
    ],
    filterIndex: 0,
    page: 1,
  }
  
  
  //pegando data
  async componentDidMount() {
    const { match } = this.props
    //chamada dos filtros no state
    const { filters } = this.state

    const repoName = decodeURIComponent(match.params.repository)

    const [repository, issues]= await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
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

  //função para pegar as issues da api e pega os filtrado
  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state
    
    const repoName = decodeURIComponent(match.params.repository)

    const response = await api.get(`/repos${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        per_page: 5,
        page,
      }
    })

    this.setState({ issues: response.data })
  }

  handlePage = async action => {
    const { page } = this.state;
    
    await this.state({
      page: action === 'back' ? page - 1 : page + 1
    })

    this.loadIssues()
  }

  handleFilterClick = async filterIndex => {
    await this.setState({ filterIndex })
    this.loadIssues()
  }
  
  render(){
    const { repository, issues, filterIndex, filters, page } = this.state
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
            <IssueFilter active={filterIndex}>
              {filters.map((filter, map) => (
                <button type="button"
                key={filter.label}
                onClick={() => this.handleFilterClick}
                >

                </button>
              ))}
            </IssueFilter>
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
          <PageActions>
            <button type="button"
            disabled={page < 2}
            onClick={() => this.handlePage('back')}
            >Anterior
            
            </button>
              <span> Página {page}</span>
              <button type='button' 
              onClick={() => this.handlePage('next')}>
                Próximo
              </button>
            </PageActions> 
      </Container>
    );
  }
}

