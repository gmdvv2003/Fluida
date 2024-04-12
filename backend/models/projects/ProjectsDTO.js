class ProjectsDTO {
    constructor({
        projectId, 
        createdBy, 
        projectName
    }){
        this.projectId = projectId;
        this.createdBy = createdBy;
        this.projectName = projectName;
    }
}

module.exports = ProjectsDTO