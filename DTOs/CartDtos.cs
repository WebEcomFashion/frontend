namespace WebFashion.DTOs
{
    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
    }

    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalPrice { get; set; }
        public List<CartItemReadDto> Items { get; set; } = new();
    }

    public class CartItemReadDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductTitle { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class CartCreateDto
    {
        public int UserId { get; set; }
    }

    public class CartUpdateDto
    {
        public decimal TotalPrice { get; set; }
    }
}
