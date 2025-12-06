namespace WebFashion.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductTitle { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
    }



    public class OrderCreateDto
    {
        public int UserId { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public decimal TotalAmount { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; } = "pending";
    }

    public class OrderReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; } // ✅ thay string → DTO
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }


    public class PaymentCreateDto
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string PaymentMethod { get; set; }
        public string CardToken { get; set; }
    }

    public class PaymentReadDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public string TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
