import { GetProjectsByUserIdEndpoint } from "utilities/Endpoints";

export async function GetProjectsByUserId(performAuthenticatedRequest) {
	return await performAuthenticatedRequest(GetProjectsByUserIdEndpoint, "GET");
}
