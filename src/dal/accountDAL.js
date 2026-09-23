const {poolPromise,sql}=require('./dbConfig');
class AccountDAL{
 async getProfile(id){const p=await poolPromise;return (await p.request().input('id',sql.Int,id).query(`SELECT MaNguoiDung,HoTen,Email,SoDienThoai,VaiTro,TinhThanh,QuanHuyen,PhuongXa,DiaChiChiTiet,AnhDaiDien,NgayTao FROM NguoiDung WHERE MaNguoiDung=@id`)).recordset[0]||null;}
 async getPurchases(id){const p=await poolPromise;return (await p.request().input('id',sql.Int,id).query(`SELECT dh.*,ct.MaSanPham,ct.TenSanPham,ct.DonGia,ct.SoLuong,ct.ThanhTien,nb.HoTen TenNguoiBan FROM DonHang dh JOIN ChiTietDonHang ct ON ct.MaDonHang=dh.MaDonHang LEFT JOIN NguoiDung nb ON nb.MaNguoiDung=ct.MaNguoiBan WHERE dh.MaNguoiMua=@id ORDER BY dh.NgayDat DESC`)).recordset;}
 async getSales(id){const p=await poolPromise;return (await p.request().input('id',sql.Int,id).query(`SELECT dh.MaDonHang,dh.TrangThai,dh.NgayDat,dh.TongThanhToan,ct.MaSanPham,ct.TenSanPham,ct.DonGia,ct.SoLuong,ct.ThanhTien,nd.HoTen TenNguoiMua,nd.Email EmailNguoiMua FROM ChiTietDonHang ct JOIN DonHang dh ON dh.MaDonHang=ct.MaDonHang LEFT JOIN NguoiDung nd ON nd.MaNguoiDung=dh.MaNguoiMua WHERE ct.MaNguoiBan=@id ORDER BY dh.NgayDat DESC`)).recordset;}
}
module.exports=new AccountDAL();
