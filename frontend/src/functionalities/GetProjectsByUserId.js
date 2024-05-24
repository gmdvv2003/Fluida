import { GetProjectsByUserIdEndpoint } from "utilities/Endpoints"

export async function GetProjectsByUserId(performAuthenticatedRequest){

    const response = await performAuthenticatedRequest(GetProjectsByUserIdEndpoint, "GET");

    if(response.success){
        console.log("DEU CERTO", response.data)
    } else {
        console.log("DEU ERRADO", response)
    }
    
    return response

}


