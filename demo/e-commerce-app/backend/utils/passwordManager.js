import bcrypt from "bcryptjs";


export function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}