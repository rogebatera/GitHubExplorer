import React, { useState, FormEvent, useEffect} from 'react';
import { FiChevronRight } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import api from '../../services/api'
import Repository from '../Repository';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard:React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@Githubexplorer:repositories');
        if(storagedRepositories){
            return JSON.parse(storagedRepositories);
        }else{
            return [];
        }
    });

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>):
        Promise<void>{

        //retira açao do submit
        event.preventDefault();

        //validacao se esta vazio form
        if(!newRepo){
            setInputError('Digite o autor/nome do repositório.');
            return
        }

        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');

        }catch(error) {
            setInputError('Erro na busca por esse repositório')
        }


    }

    useEffect(() => {
        localStorage.setItem('@Githubexplorer:repositories',
        JSON.stringify(repositories));
    }, [repositories]);

    return (
        <>
            <img src={logoImg} alt="Github Explorer"/>

            <Title>Explore repositório no Github.</Title>
            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <a key={repository.full_name} href="teste">
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </a>
                ))}
            </Repositories>

        </>
    )
};

export default Dashboard;
