const { v4 } = require("uuid");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsEntity = require("./ProjectsEntity");

const projects = [

];

class ProjectsService {
   
    /**
     * Criação de um novo projeto.
     * 
     * @param {number} createdBy 
     * @param {string} projectName 
     * @returns Criação de um novo projeto para o usuário.
     */
    createProject(createdBy, projectName){
        try {
            const project = new ProjectsEntity(v4(), createdBy, projectName);
            projects.push(project);
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    /**
     * Retorna projetos do usuário pelo ID
     * 
     * @param {number} userId 
     * @returns DTO dos projetos do usuário
     */
    getProjectsByUserId(userId) {
        const projectsUser = projects.filter(project => project.userId === userId);

        const projectsUserDTO = projectsUser.map((project) => new ProjectsDTO(project));

        return projectsUserDTO
    }

    // projectsMembers = [
    //     {
    //         projectId: 1,
    //         userId: 5
    //     },
    //     {
    //         projectId: 2,
    //         userId: 5
    //     },
    //     {
    //         projectId: 1,
    //         userId: 5
    //     },
    //     {
    //         projectId: 2,
    //         userId: 5
    //     },
    //     {
    //         projectId: 1,
    //         userId: 65
    //     },
    //     {
    //         projectId: 2,
    //         userId: 2
    //     },
    //     {
    //         projectId: 1,
    //         userId: 51
    //     },
    //     {
    //         projectId: 2,
    //         userId: 53
    //     },
    // ]

}

module.exports = ProjectsService;
