/**
 * Configuración centralizada de autorización para Social Studio 2.9
 * 
 * Regla de negocio:
 * - Rol `superadmin` siempre tiene acceso pleno.
 * - En modo `admin`, acceso exclusivo otorgado a Franco Roma (`franeroma@gmail.com`).
 * - Demás administradores o clientes no tienen acceso al módulo.
 */

export const SOCIAL_STUDIO_AUTHORIZED_EMAILS = ['franeroma@gmail.com'];

export function isSocialStudioAuthorized(subject) {
  if (!subject) return false;

  // Si se pasa el objeto de sesión (session) o directamente session.user / token
  const user = subject.user || subject;
  const role = user.role;
  const email = (user.email || '').toLowerCase().trim();

  if (role === 'superadmin') return true;
  if (role === 'admin' && SOCIAL_STUDIO_AUTHORIZED_EMAILS.includes(email)) return true;

  return false;
}
