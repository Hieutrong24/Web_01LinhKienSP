using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class SanPhamModel
    {
        public int ID { get; set; }
        public string TenSP { get; set; }
        public double? GiaGoc { get; set; }
        public double? GiaHT { get; set; }
        public string Img { get; set; }
    }
}