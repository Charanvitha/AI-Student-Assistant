import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}
