
import {roles} from '../../middleware/auth.js'

export const endPoints = {
    create :[roles.User],
    update :[roles.User],
    delete :[roles.User],
    get :[roles.User],

}