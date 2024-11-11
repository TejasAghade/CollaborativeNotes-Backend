import { User } from "../../squalize_schema/user.schema";
import EncryptionHelper from "../../helpers/encryption.helper";
import ApiResponse, { serverError } from "../../utils/response/api_response";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

class UserService {

    public static getUsers = async () => {

        try {

            const users = await User.findAll({
                attributes: ['fullName', 'email', 'uId']
            });

            const userJson = users.map((user: any) => user.toJSON())


            if (users.length == 0) {
                return new ApiResponse(
                    "no users found!",
                    [],
                    null,
                    404,
                );
            }


            return new ApiResponse(
                "success!",
                [],
                userJson,
                200,
            );


        } catch (err) {
            return serverError(err);
        }

    }

    public static register = async (userData: any) => {

        const { fullName, email, password } = userData;

        try {
            // validation
            if (!fullName || !email || !password) {

                let errors = [];

                if (!fullName) {
                    errors.push("fullName field cannot be empty");
                }

                if (!email) {
                    errors.push("email field cannot be empty");
                }

                if (!email) {
                    errors.push("email field cannot be empty");
                }

                return new ApiResponse(
                    "all fields are required",
                    errors,
                    null,
                    400,
                )
            }

            const encryptedPassword = await EncryptionHelper.encryptPassword(password);

            let uId = uuidv4();

            await User.create({ uId: uId, fullName: fullName, email: email, password: encryptedPassword });

            const data = { uId, fullName, email };

            const accessToken = UserService.generateAccessToken(data);

            // Prepare the response
            return new ApiResponse(
                "Account created",
                [],
                {
                    ...data,
                    token: accessToken,
                },
                201,
            );

        } catch (err) {
            return serverError(err);
        }
    }

    public static login = async (userData: any) => {

        const { email, password } = userData;

        if (!email || !password) {

            let errors = [];

            if (!email) {
                errors.push("email field cannot be empty");
            }

            if (!password) {
                errors.push("password field cannot be empty");
            }

            return new ApiResponse(
                "all fields are required",
                errors,
                null,
                400,
            );
        }

        try {

            const user = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            );


            if (!user) {
                return new ApiResponse(
                    "User not found!",
                    ["user not found!"],
                    null,
                    404,
                )
            }


            if (!await EncryptionHelper.validatePassoword(password, user.dataValues.password)) {
                return new ApiResponse(
                    "Invalid credentials",
                    ["Invalid credentials"],
                    null,
                    401,
                );
            }


            const data = {
                uId: user.dataValues.uId,
                email: user.dataValues.email,
                fullName: user.dataValues.fullName
            };

            const accessToken = UserService.generateAccessToken(data);

            console.log(accessToken);


            return new ApiResponse(
                "loggedin!",
                null,
                {
                    ...data,
                    token: accessToken,
                },
                200,
            );


        } catch (err) {
            return serverError(err);
        }


    }

    public static search = async () => {

    }


    static generateAccessToken = (data: any) => {
        let token = jwt.sign(
            data,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );

        return token;
    }

    static decodeAccessToken = (token: string) => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }

    static authorizationError = () => {
        return new ApiResponse(
            "Unauthorize request!",
            [],
            null,
            401,
        );
    }

}

export default UserService;