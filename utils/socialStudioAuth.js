/**
 * Configuración centralizada de autorización para Social Studio 2.9 y herramientas de difusión IG
 *
 * Regla de negocio:
 * - Roles `superadmin` y `admin` tienen acceso pleno a Social Studio y a los botones de compartir Story/Feed de Instagram.
 * - Usuarios con rol `client` / `user` o sin sesión no tienen acceso.
 */

export function isSocialStudioAuthorized(subject) {
  if (!subject) return false;

  // Si se pasa el objeto de sesión (session) o directamente session.user / token
  const user = subject.user || subject;
  const role = user?.role;

  return role === 'superadmin' || role === 'admin';
}
