import jwt from 'jsonwebtoken';

export function authenticateToken(request, response, next) {
  const authorization = request.get('authorization');
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Autenticação necessária.' });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

export function authorizeRoles(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ error: 'Não tem permissões para esta operação.' });
    }
    return next();
  };
}