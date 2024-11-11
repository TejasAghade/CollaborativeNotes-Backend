import { User } from "../../squalize_schema/user.schema";
import EncryptionHelper from "../../helpers/encryption.helper";
import ApiResponse, { serverError } from "../../utils/response/api_response";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import redisClient from "../../redis/redis";

class UserService {

    public static getUsers = async () => {

        try {

            const cachedUsers = await redisClient.get('user:userData');

            if ((JSON.parse(cachedUsers) || []).length != 0) {
                console.log("users is in cache");
                return new ApiResponse(
                    "success!",
                    [],
                    JSON.parse(cachedUsers),
                    200,
                );
            }

            const users = await User.findAll({
                attributes: ['fullName', 'email', 'uId']
            });

            const userJson = users.map((user: any) => user.toJSON());

            await redisClient.set('user:userData', JSON.stringify(userJson));
            await redisClient.expire('user:userData', 60 * 60 * 24)

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



            const isUserExist = await User.findOne({
                where: {
                    email: email
                }
            });

            if (!!isUserExist && !!isUserExist.dataValues) {
                return new ApiResponse(
                    "User already exist",
                    [],
                    null,
                    400,
                )
            }


            const encryptedPassword = await EncryptionHelper.encrypt(password);

            let uId = uuidv4();

            await User.create({ uId: uId, fullName: fullName, email: email, password: encryptedPassword });

            await redisClient.expire('user:userData', 15)

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

            let decryptedPass = EncryptionHelper.decrypt(user.dataValues.password);

            // using crypto
            if (password !== decryptedPass) {
                return new ApiResponse(
                    "Invalid credentials",
                    ["Invalid credentials"],
                    null,
                    401,
                );
            }

            // using bcrypt
            // if (!await EncryptionHelper.validatePassoword(password, user.dataValues.password)) {
            //     return new ApiResponse(
            //         "Invalid credentials",
            //         ["Invalid credentials"],
            //         null,
            //         401,
            //     );
            // }


            const data = {
                uId: user.dataValues.uId,
                email: user.dataValues.email,
                fullName: user.dataValues.fullName
            };

            const accessToken = UserService.generateAccessToken(data);

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