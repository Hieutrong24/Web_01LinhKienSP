using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class HomeViewModel
    {
        public List<DanhMuc_Model> DanhMucs { get; set; }
        //public List<ChiTietDanhMuc_Model> ChiTietDanhMucs { get; set; }
        public List<SanPhamModel> SanPhams { get; set; }
    }
}