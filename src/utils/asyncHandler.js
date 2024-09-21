const AsyncHandler = (fn) => {
    return async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
    };
};

export { AsyncHandler };

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message:error.message
//         })
//     }
// }













// import { createAccessRefreshToken } from "../collection/user.collection.js"; // Example import for token generation
// import { ApiError } from "../utils/ErrorHandler.js";
// const AsyncHandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     };
// };

// const loginUser = AsyncHandler(async (req, res, next) => {
//     const user = await findUserByCredentials(req.body.username, req.body.password);

//     if (!user) {
//         throw new ApiError(401, "Invalid credentials");
//     }

//     // Generate tokens
//     const { accessToken, refreshToken } = await createAccessRefreshToken(user._id);

//     // Make sure accessToken and refreshToken exist before using
//     if (!accessToken || !refreshToken) {
//         throw new ApiError(400, "Access token and refresh token are not generated");
//     }

//     // Respond with tokens
//     res.status(200).json({
//         accessToken,
//         refreshToken,
//     });
// });



//export {AsyncHandler}