class ProjectsEntity {
    constructor(projectId, createdBy, projectName)
    {
        if (!projectId || !createdBy || !projectName){
            throw new Error("Todos os campos são obrigatórios.");
        }

        if (typeof createdBy !== number) {
			throw new Error("createdBy deve ser um Number.");
		}

		if (typeof projectName !== "string") {
			throw new Error("projectName deve ser uma string.");
		}

        this.projectId = projectId;
        this.createdBy = createdBy;
        this.projectName = projectName
    }

}

module.exports = ProjectsEntity;