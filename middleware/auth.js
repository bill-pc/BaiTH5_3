export function requireAuth(req, res, next){
  if(!req.session.user){
    req.session.flash = { type: 'error', message: 'Bạn cần đăng nhập.' };
    return res.redirect('/auth/login');
  }
  next();
}
