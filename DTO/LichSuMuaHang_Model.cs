using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class LichSuMuaHang_Model
    {
        public int SoLuong { get; set; }
        public int Id_TTGioHang { get; set; }   
        public DateTime NgayMua { get; set; }

        public string DiaChiNhanHang { get; set; }
    }
}