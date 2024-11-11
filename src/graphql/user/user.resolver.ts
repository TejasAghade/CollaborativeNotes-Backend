import UserService from "../../services/user/user.service";
import ApiResponse from "../../utils/response/api_response";

const getUsers = async (_: any, __: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    const apiResponse = await UserService.getUsers();

    return apiResponse;

}


const searchUser = (_: any, payload: any, context: any) => {

    if (!!!context.user) {
        return UserService.authorizationError();
    }

}

const registerUser = async (_: any, payload: any,) => {

    const apiResponse = await UserService.register(payload.userData);
    return apiResponse;

}

const loginUser = async (_: any, payload: any) => {

    console.log(payload);


    const apiResponse = await UserService.login(payload.userData);
    return apiResponse;

}

export const userQueriesResolver = {
    getUsers,
    loginUser,
    searchUser,
}

export const userMutationsResolver = {
    registerUser,
}

