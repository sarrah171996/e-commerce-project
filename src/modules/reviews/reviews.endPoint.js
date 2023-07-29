import { roles } from "../../middleware/auth.js";

export const endPoints ={
    createReview : [roles.User],
    updateReview : [roles.User],
}