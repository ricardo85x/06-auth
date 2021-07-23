import { useAuth } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions";

type useCanProps = {
    permissions?: string[];
    roles?: string[];
}

export const useCan = ({ permissions = [], roles = []} : useCanProps ) => {
    const {user,isAuthenticated} = useAuth()

    if (!isAuthenticated) {
        return false;
    }

    return validateUserPermissions({user, permissions, roles})
 
}