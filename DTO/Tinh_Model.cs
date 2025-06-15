using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_01LinhKienSP.DTO
{
    public class Tinh_Model
    {
        public int Id { get; set; }
        public string TenTinh { get; set; }
        public List<Xa_Model> XaPhuongs { get; set; }
    }
}