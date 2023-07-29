
import {roles} from '../../middleware/auth.js'

export const endPoints = {
    create :[roles.Admin , roles.User],
    update :[roles.Admin , roles.User],
    delete :[roles.Admin , roles.User],
    get :[roles.Admin , roles.User],
    cancel:[roles.User],
    adminUpdateOrder :[roles.Admin ,roles.User]

}