import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

export const list = async (req,res)=>{
  const { q, supplier } = req.query;
  const filter = {};
  if(q) filter.name = { $regex: q, $options: 'i' };
  if(supplier && supplier !== 'all') filter.supplier = supplier;
  const [products, suppliers] = await Promise.all([
    Product.find(filter).populate('supplier').sort({ createdAt: -1 }),
    Supplier.find().sort({ name: 1 })
  ]);
  res.render('index', { title: 'Trang chủ', products, suppliers, q: q||'', supplierSelected: supplier||'all' });
};

export const adminList = async (req,res)=>{
  const products = await Product.find().populate('supplier').sort({ createdAt: -1 });
  res.render('products/index', { title: 'Sản phẩm', products });
};

export const createForm = async (req,res)=>{
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.render('products/form', { title: 'Thêm sản phẩm', product: {}, suppliers });
};

export const create = async (req,res)=>{
  try{
    const { name, price, quantity, supplier } = req.body;
    await Product.create({ name, price, quantity, supplier });
    req.session.flash = { type: 'success', message: 'Đã tạo sản phẩm' };
    res.redirect('/products');
  }catch(err){
    req.session.flash = { type: 'error', message: err.message };
    res.redirect('/products/create');
  }
};

export const editForm = async (req,res)=>{
  const [product, suppliers] = await Promise.all([
    Product.findById(req.params.id),
    Supplier.find().sort({ name: 1 })
  ]);
  if(!product) return res.redirect('/products');
  res.render('products/form', { title: 'Sửa sản phẩm', product, suppliers });
};

export const update = async (req,res)=>{
  const { name, price, quantity, supplier } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, quantity, supplier });
  req.session.flash = { type: 'success', message: 'Đã cập nhật' };
  res.redirect('/products');
};

export const remove = async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  req.session.flash = { type: 'success', message: 'Đã xóa' };
  res.redirect('/products');
};
