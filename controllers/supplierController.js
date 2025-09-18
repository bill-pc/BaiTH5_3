import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';

export const list = async (req,res)=>{
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.render('suppliers/index', { title: 'Nhà cung cấp', suppliers });
};

export const createForm = (req,res)=>{
  res.render('suppliers/form', { title: 'Thêm nhà cung cấp', supplier: {} });
};

export const create = async (req,res)=>{
  try{
    await Supplier.create(req.body);
    req.session.flash = { type: 'success', message: 'Đã tạo nhà cung cấp' };
    res.redirect('/suppliers');
  }catch(err){
    req.session.flash = { type: 'error', message: err.message };
    res.redirect('/suppliers/create');
  }
};

export const editForm = async (req,res)=>{
  const supplier = await Supplier.findById(req.params.id);
  if(!supplier) return res.redirect('/suppliers');
  res.render('suppliers/form', { title: 'Sửa nhà cung cấp', supplier });
};

export const update = async (req,res)=>{
  await Supplier.findByIdAndUpdate(req.params.id, req.body);
  req.session.flash = { type: 'success', message: 'Đã cập nhật' };
  res.redirect('/suppliers');
};

export const remove = async (req,res)=>{
  // Prevent deleting if products exist
  const count = await Product.countDocuments({ supplier: req.params.id });
  if(count>0){
    req.session.flash = { type: 'error', message: 'Không thể xóa: còn sản phẩm tham chiếu.' };
    return res.redirect('/suppliers');
  }
  await Supplier.findByIdAndDelete(req.params.id);
  req.session.flash = { type: 'success', message: 'Đã xóa' };
  res.redirect('/suppliers');
};
