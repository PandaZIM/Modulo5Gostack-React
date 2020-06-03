import React, { Component } from 'react'
import { FaGithubAlt, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'


import { Container, Form, SubmitButton, List } from './styles'

export default class Main extends Component {
    
    //Setando data
    state = {
        newRepo: '',
        repositories:[],
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

    handeInputchange = e => {
        this.setState({ newRepo: e.target.value })
    }

    //Aplicando data
    handleSubmit = async e => {
        e.preventDefault()
        
        const { newRepo, repositories } = this.state

        //chamada da api
        const response = await api.get(`/repos/${newRepo}`)
        
        const data = {
            name: response.data.full_name,
        }

        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
        })

    }

    render() {
        const { newRepo, repositories } = this.state


        return (
            <Container>
                <h1>
                    <FaGithubAlt/>
                    Repositórios  
                </h1>
        
                <Form onSubmit = {this.handleSubmit}>
                    
                    <input 
                        type="text"
                        placeholder="Adicionar repositorio"
                        value={newRepo}
                        onChange={this.handeInputchange} 
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
