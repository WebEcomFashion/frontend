using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebFashion.DTOs;

namespace WebFashion.Models
{
    public enum OrderStatus
    {
        Pending = 0,
        Processing = 1,
        Completed = 2,
        Cancelled = 3
    }

    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Required]
        public string ShippingAddress { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; }

        public string? PaymentId { get; set; } // Cho phép null


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
