/* eslint-disable react/state-in-constructor */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProjectsActions from '~/store/ducks/projects';
import MembersActions from '~/store/ducks/members';

import Can from '~/components/Can';
import Members from '~/components/Members';
import Button from '~/styles/components/Button';

import Modal from '~/components/Modal';
import { Container, Project } from './styles';

class Projects extends Component {
  state = {
    newProject: '',
  }

  componentDidMount() {
    const { getProjectsRequest, activeTeam } = this.props;

    if (activeTeam) {
      getProjectsRequest();
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCreateProject = (e) => {
    e.preventDefault();

    const { createProjectRequest } = this.props;
    const { newProject } = this.state;

    createProjectRequest(newProject);
  }

  render() {
    const {
      activeTeam, projects, openProjectModal, closeProjectModal, openMembersModal, members,
    } = this.props;

    const { newProject } = this.state;

    if (!activeTeam) return null;

    return (
      <Container>
        <header>
          <h1>{activeTeam.name}</h1>
          <div>
            <Can checkPermission="projects_create">
              <Button onClick={openProjectModal}>+ Novo</Button>
            </Can>
            <Button onClick={openMembersModal}>Membros</Button>
          </div>
        </header>

        {projects.data.map((project) => (
          <Project key={project.id}>
            <p>{project.title}</p>
          </Project>
        ))}

        { projects.projectModalOpen && (
        <Modal>
          <h1>Criar projeto</h1>

          <form onSubmit={this.handleCreateProject}>
            <span>NOME</span>
            <input name="newProject" value={newProject} onChange={this.handleInputChange} />

            <Button size="big" type="submit">Salvar</Button>
            <Button onClick={closeProjectModal} size="small" color="gray">Cancelar</Button>
          </form>
        </Modal>
        ) }

        { members.membersModalOpen && <Members /> }
      </Container>
    );
  }
}

Projects.propTypes = {
  getProjectsRequest: PropTypes.func.isRequired,
  openProjectModal: PropTypes.func.isRequired,
  closeProjectModal: PropTypes.func.isRequired,
  createProjectRequest: PropTypes.func.isRequired,
  openMembersModal: PropTypes.func.isRequired,
  activeTeam: PropTypes.shape({
    name: PropTypes.string,
  }),
  projects: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })),
    projectModalOpen: PropTypes.bool,
  }).isRequired,
  members: PropTypes.shape({
    membersModalOpen: PropTypes.bool,
  }).isRequired,
};

Projects.defaultProps = {
  activeTeam: null,
};

const mapStateToProps = (state) => ({
  activeTeam: state.teams.active,
  projects: state.projects,
  members: state.members,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  { ...ProjectsActions, ...MembersActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
