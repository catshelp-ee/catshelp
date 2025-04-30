
import db from "../../../models/index.cjs";
import { Op } from "sequelize";

export function deleteExpiredRevokedTokens() {
    db.RevokedToken.destroy({
        where: {
            expiresAt : {
                [Op.lt] : new Date()
            }
        }
    });
}
