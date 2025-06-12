using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class DanhMuc_Model
    {
        public int MaDanhMuc { get; set; }
        public string TenDanhMuc { get; set; }

        public List<ChiTietDanhMuc_Model> ChiTietDanhMucs { get; set; }
    }
}