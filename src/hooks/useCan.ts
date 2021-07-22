import { useAuth } from "../contexts/AuthContext"

type useCanProps = {
    permissions?: string[];
    roles?: string[];
}

export const useCan = ({ permissions = [], roles = []} : useCanProps ) => {
    const {user,isAuthenticated} = useAuth()

    if (!isAuthenticated) {
        return false;
    }

    if(permissions.length){
        const hasAllPermissions = permissions.some(permission => {
            return user.permissions.includes(permission)
        })

        if(!hasAllPermissions){
            return false;
        }
    }

    if(roles.length){
        const hasAllRoles = roles.some(role => {
            return user.roles.includes(role)
        })

        if(!hasAllRoles){
            return false;
        }
    }

    return true

    
}