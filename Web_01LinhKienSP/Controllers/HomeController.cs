using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web_01LinhKienSP.DTO;
using Web_01LinhKienSP.Models;
namespace Web_01LinhKienSP.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home

        public ActionResult Index()
        {
            using (var db = new QL_LinhKienDienTuEntities5())
            {
                var dsSanPham = db.SanPham.Select(sp => new SanPhamModel
                {
                    TenSP = sp.TENSP,
                    GiaGoc = sp.GIAGOC,
                    GiaHT = sp.GIAHT,
                    Img = sp.IMG
                }).ToList();

                return View(dsSanPham);
            }
        }



        public ActionResult Introduce()
        {
            return View();
        }
        public ActionResult File()
        {
            return View();
        }
        public ActionResult DangNhap()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DangNhap(TaiKhoan model)
        {
            if (ModelState.IsValid)
            {
                using (var db = new QL_LinhKienDienTuEntities5())
                {
                    // So sánh mật khẩu (giữ nguyên nếu không mã hóa)
                    var taikhoan = db.TaiKhoan.FirstOrDefault(
                        x => x.EMAIL == model.EMAIL && x.PASSWORD == model.PASSWORD
                    );

                    if (taikhoan != null)
                    {
                        // Chỉ lưu thông tin cần thiết vào Session
                        Session["Email"] = taikhoan.EMAIL;
                        Session["HoTen"] = taikhoan.HOTEN;

                        TempData["Success"] = "Đăng nhập thành công!";
                        return RedirectToAction("TrangChu", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Email hoặc mật khẩu không đúng.");
                    }
                }
            }

            return View(model);
        }

        public ActionResult TrangChu()
        {
            using (var db = new QL_LinhKienDienTuEntities5())
            {
                var dsSanPham = db.SanPham.Select(sp => new SanPhamModel
                {
                    TenSP = sp.TENSP,
                    GiaHT = sp.GIAHT,
                    GiaGoc = sp.GIAGOC,
                    Img = sp.IMG
                }).ToList();
                return View(dsSanPham);
            }
        }
        public ActionResult DangKy()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]

        public ActionResult DangKy(TaiKhoan model)
        {
            if (ModelState.IsValid)
            {
                using (var db = new QL_LinhKienDienTuEntities5())
                {
                    try
                    {
                        db.TaiKhoan.Add(model);
                        db.SaveChanges();
                        var gioHang = new GioHang
                        {
                            EMAILTAIKHOAN = model.EMAIL,
                            NGAYTAO = DateTime.Now
                        };
                        
                        db.GioHang.Add(gioHang);
                        db.SaveChanges();
                    }
                    catch (System.Data.Entity.Validation.DbEntityValidationException e)
                    {
                        foreach (var valitionErroes in e.EntityValidationErrors)
                        {
                            foreach (var valitionError in valitionErroes.ValidationErrors)
                            {
                                ModelState.AddModelError(valitionError.PropertyName, valitionError.ErrorMessage);
                            }
                        }
                        return View(model);
                    }

                }
                return RedirectToAction("DangKyThanhCong");
            }
            return View(model);
        }
        public ActionResult DangKyThanhCong()
        {
            return View();
        }

        public ActionResult Intel_core()
        {
            using (var db = new QL_LinhKienDienTuEntities5())
            {
                string tenSanPhamCanTim = "Intel Core";
                var dsSanPham = db.SanPham.Where(sp => sp.IDLOAISP == 11 && sp.TENSP.Contains(tenSanPhamCanTim)).Select(sp => new SanPhamModel
                {
                    ID = sp.ID,
                    TenSP = sp.TENSP,
                    GiaGoc = sp.GIAGOC,
                    GiaHT = sp.GIAHT,
                    Img = sp.IMG

                }).ToList();
                return View(dsSanPham);
            }
        }
        public ActionResult Amd_ryzen()
        {
            using (var db = new QL_LinhKienDienTuEntities5())
            {
                string tenSanPhamCanTim = "AMD Ryzen";
                var dsSanPham = db.SanPham.Where(sp => sp.IDLOAISP == 11 && sp.TENSP.Contains(tenSanPhamCanTim)).Select(sp => new SanPhamModel
                {
                    ID = sp.ID,
                    TenSP = sp.TENSP,
                    GiaGoc = sp.GIAGOC,
                    GiaHT = sp.GIAHT,
                    Img = sp.IMG
                }).ToList();
                return View(dsSanPham);
            }
        }
        
        
        public ActionResult ThongTinGioHang()
        {
            if (Session["Email"] == null)
            {
                return RedirectToAction("DangNhap", "Home");
            }
            using (var db = new QL_LinhKienDienTuEntities5())
            {
                string userEmail = (string)Session["Email"];
                var temp = db.GioHang.FirstOrDefault(sp => sp.EMAILTAIKHOAN == userEmail);
                var dsGioHang = db.ThongTin_GioHang.Where(sp => sp.IDGIOHANG == temp.ID).Select(sp => new ChiTietGioHangModel
                {
                    ID = sp.ID,
                    TENSP = sp.TENSP,
                    GIAGOC = sp.GIAGOC,
                    GIAHT = sp.GIAHT,
                    IMG = sp.IMG,
                    IDGIOHANG = (int)sp.IDGIOHANG,
                    SOLUONG = (int)sp.SOLUONG
                }).ToList();
                return View(dsGioHang);
            }
        }
        [HttpPost]
        public ActionResult ThongTinGioHang(ChiTietGioHangModel item) // Thay đổi từ List sang một item duy nhất
        {
            // Kiểm tra xem item có null không
            if (item == null)
            {
                return new HttpStatusCodeResult(400, "Không có dữ liệu sản phẩm để thêm vào giỏ hàng.");
            }

            using (var db = new QL_LinhKienDienTuEntities5())
            {
                var userEmail = (string)Session["Email"];
                if (userEmail == null)
                {
                    // Nếu người dùng chưa đăng nhập, bạn có thể chuyển hướng đến trang đăng nhập
                    // hoặc trả về lỗi 401 để JavaScript xử lý.
                    return new HttpStatusCodeResult(401, "Người dùng chưa đăng nhập.");
                }

                var gioHang = db.GioHang.FirstOrDefault(gh => gh.EMAILTAIKHOAN == userEmail);

                // Nếu người dùng đã đăng nhập nhưng chưa có giỏ hàng, tạo mới một giỏ hàng cho họ
                if (gioHang == null)
                {
                    // Bạn cần tạo một record GioHang mới cho người dùng này
                    // Ví dụ:
                    gioHang = new GioHang
                    {
                        EMAILTAIKHOAN = userEmail,
                        NGAYTAO = DateTime.Now // Cần thêm thuộc tính NGAYTAO trong model GioHang của bạn
                    };
                    db.GioHang.Add(gioHang);
                    db.SaveChanges(); // Lưu để có ID cho gioHang mới
                }

                // Kiểm tra xem sản phẩm đã có trong giỏ hàng này chưa
                var chiTietHienCo = db.ThongTin_GioHang.FirstOrDefault(ct =>
                    ct.IDGIOHANG == gioHang.ID && ct.TENSP == item.TENSP // Giả sử TENSP là unique hoặc cần IDSP
                );

                if (chiTietHienCo != null)
                {
                    // Nếu sản phẩm đã có, chỉ cập nhật số lượng
                    chiTietHienCo.SOLUONG += item.SOLUONG; // Tăng số lượng
                }
                else
                {
                    // Nếu sản phẩm chưa có, thêm mới chi tiết giỏ hàng
                    var chiTietMoi = new ThongTin_GioHang
                    {
                        IDGIOHANG = gioHang.ID,
                        TENSP = item.TENSP,
                        IMG = item.IMG,
                        GIAGOC = (float)(item.GIAGOC ?? 0.0), // Chuyển đổi double? sang float
                        GIAHT = (float)(item.GIAHT ?? 0.0),   // Chuyển đổi double? sang float
                        SOLUONG = item.SOLUONG // Lấy số lượng từ item gửi lên
                    };
                    db.ThongTin_GioHang.Add(chiTietMoi);
                }

                db.SaveChanges(); // Lưu thay đổi vào database (thêm mới hoặc cập nhật số lượng)
            }

            return new HttpStatusCodeResult(200, "Đã thêm sản phẩm vào giỏ hàng.");
        }

    }
}