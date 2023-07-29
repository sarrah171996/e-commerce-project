
import {roles} from '../../middleware/auth.js'

export const endPoints = {
    create :[roles.Admin , roles.User],
    update :[roles.Admin , roles.User],
    delete :[roles.Admin],
    get :[roles.Admin],

}