using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebFashion.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [Required]
        [StringLength(200)]
        public string ProductTitle { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }

        [StringLength(50)]

        public string? Size { get; set; }   // bắt buộc


        [StringLength(50)]
        public string? Color { get; set; }
    }
}
