
export const isSuperAdmin = (user: any) =>
  user.roles.includes('SUPERADMIN')
