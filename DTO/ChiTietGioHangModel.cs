using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class ChiTietGioHangModel
    {
        public int ID { get; set; }
        public string TENSP { get; set; }
        public double? GIAGOC { get; set; }
        public double? GIAHT { get; set; }
        public string IMG { get; set; }
        public int SOLUONG { get; set; }
        public int IDGIOHANG { get; set; }

    }
}