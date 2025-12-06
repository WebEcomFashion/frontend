using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebFashion.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CartId { get; set; }

        [ForeignKey("CartId")]
        public Cart Cart { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [Required]
        public int Quantity { get; set; }

        [StringLength(50)]
        public string Size { get; set; }

        [StringLength(50)]
        public string Color { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
