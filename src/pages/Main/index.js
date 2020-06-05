import React, { Component } from 'react'
import { FaGithubAlt, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import Container from '../../components/Container'

import { Form, SubmitButton, List } from './styles'

export default class Main extends Component {
    
    //Setando data
    state = {
        newRepo: '',
        repositories:[],
        error: null
    }


    //carregar dados do localStorage
    componentDidMount() {
        const repositories = localStorage.getItem('repositories')

        if(repositories) {
            this.setState({ repositories: JSON.parse(repositories)})
        }
    }

    //Salvar dados do localStorage
    componentDidUpdate(prevState) {
        const { repositories } = this.state

        if (prevState.repositories !== repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    handleInputchange = e => {
        this.setState({ newRepo: e.target.value })
    }

    //Aplicando data
    handleSubmit = async e => {
        
        //setando error para conseguir pegar error
        this.setState({ error: false})
        
        //tentativa de achar error
        try{

        e.preventDefault()
        
        const { newRepo, repositories } = this.state

        const hasRepo = repositories.find( repo => repo.name === newRepo)

        if (hasRepo) throw new Error('repositorio duplicado')

        //chamada da api
        const response = await api.get(`/repos/${newRepo}`)
        
        const data = {
            name: response.data.full_name,
        }

        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
        })

      } catch (error){
        //caso achar error, error seta true
        this.setState({ error: true })
        
      }
        
    }

    render() {
        const { newRepo, repositories, error } = this.state

    
        return (
            <Container>
                <h1>
                    <FaGithubAlt/>
                    Repositórios  
                </h1>
        
                <Form onSubmit = {this.handleSubmit} error ={error}>
                    
                    <input 
                        type="text"
                        placeholder="Adicionar repositorio"
                        value={newRepo}
                        onChange={this.handleInputchange} 
                     />
        
                    <SubmitButton>
                        <FaPlus color="#FFF" size={14} /> 
                    </SubmitButton>

                </Form> 

                <List> 
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to = {`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>)
    }
}
