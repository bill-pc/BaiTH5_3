import User from '../models/User.js';

export const getRegister = (req,res)=>{
  res.render('auth/register', { title: 'Đăng ký' });
};

export const postRegister = async (req,res)=>{
  try{
    const { username, password, email, phone } = req.body;
    await User.create({ username, password, email, phone });
    req.session.flash = { type: 'success', message: 'Đăng ký thành công. Hãy đăng nhập.' };
    res.redirect('/auth/login');
  }catch(err){
    req.session.flash = { type: 'error', message: 'Đăng ký thất bại: ' + err.message };
    res.redirect('/auth/register');
  }
};

export const getLogin = (req,res)=>{
  res.render('auth/login', { title: 'Đăng nhập' });
};

export const postLogin = async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user || !(await user.comparePassword(password))){
    req.session.flash = { type: 'error', message: 'Sai username hoặc mật khẩu.' };
    return res.redirect('/auth/login');
  }
  req.session.user = { id: user._id, username: user.username };
  res.redirect('/');
};

export const logout = (req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/');
  });
};

export const getForgot = (req,res)=>{
  res.render('auth/forgot', { title: 'Quên mật khẩu' });
};

export const postForgot = async (req,res)=>{
  const { email, phone, newPassword } = req.body;
  try{
    const user = await User.findOne({ email, phone });
    if(!user){
      req.session.flash = { type: 'error', message: 'Không tìm thấy người dùng với email/phone.' };
      return res.redirect('/auth/forgot');
    }
    user.password = newPassword;
    await user.save();
    req.session.flash = { type: 'success', message: 'Đã đặt lại mật khẩu. Hãy đăng nhập.' };
    res.redirect('/auth/login');
  }catch(err){
    req.session.flash = { type: 'error', message: 'Lỗi: ' + err.message };
    res.redirect('/auth/forgot');
  }
};
