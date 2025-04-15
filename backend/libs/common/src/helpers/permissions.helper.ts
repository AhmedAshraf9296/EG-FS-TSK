export class CrudPermissions {
  Create: string
  Read: string
  Update: string
  Delete: string

  Permissions: {
    Create: string
    Read: string
    Update: string
    Delete: string
  }

  constructor(name: string) {
    const nameUpperCased = name.charAt(0).toUpperCase() + name.substring(1)
    this.Create = `CanCreate${nameUpperCased}`
    this.Read = `CanRead${nameUpperCased}`
    this.Delete = `CanDelete${nameUpperCased}`
    this.Update = `CanUpdate${nameUpperCased}`
    this.Permissions = {
      Create: this.Create,
      Read: this.Read,
      Delete: this.Delete,
      Update: this.Update,
    }
  }
}

export class Permission {
  public readonly name: string

  constructor(name: string) {
    this.name = name
  }
}

/**
 * @description Check if user has permission, on the first permission match, return true
 * @param userPermissions user permissions
 * @param requiredPermissions required permissions
 * @returns boolean
 *
 * @example
 * ```ts
 * const userPermissions = ['CanCreateUser', 'CanReadUser', 'CanUpdateUser', 'CanDeleteUser']
 * const requiredPermissions = ['CanReadUser', 'AnotherPermission']
 * const hasPermission = checkPermissionsMatchFirstOne(userPermissions, requiredPermissions)
 * // hasPermission = true
 * ```
 */
export function checkPermissionsMatchFirstOne(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  for (const perm of requiredPermissions) {
    if (userPermissions.includes(perm)) {
      return true
    }
  }
  return false
}

/**
 * @description Check if user has permission, must match all permissions, return true
 * @param userPermissions user permissions
 * @param requiredPermissions required permissions
 * @returns boolean
 *
 * @example
 * ```ts
 * const userPermissions = ['CanCreateUser', 'CanReadUser', 'CanUpdateUser', 'CanDeleteUser']
 * const requiredPermissions = ['CanReadUser', 'AnotherPermission']
 * const hasPermission = checkPermissionsMatchAll(userPermissions, requiredPermissions)
 * // hasPermission = false
 * ```
 */
export function checkPermissionsMatchAll(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every(perm => userPermissions.includes(perm))
}
