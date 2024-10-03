import { authenticateToken } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
    authenticateToken(req, res, next);
}