export default function checkPermission(name, store) {
  if (!(name && store)) return false;

  const userRole = store.getters['Authorization/userRole'],
        mapPermissions = store.getters['Authorization/mapPermissions'];
  
  return userRole &&
    (
      !mapPermissions.has(name) ||
      (
        !userRole.permissionIDs ||
        userRole.permissionIDs.includes(mapPermissions.get(name).id)
      )
    );
}