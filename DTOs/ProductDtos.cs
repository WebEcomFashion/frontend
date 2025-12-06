namespace WebFashion.DTOs
{
    public class ProductCreateDto
    {
        public string ProductTitle { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string BrandName { get; set; }
        public int CategoryId { get; set; }
        public ProductImageDto ImageUrl { get; set; }
    }

    public class ProductUpdateDto
    {
        public string ProductTitle { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string BrandName { get; set; }
        public int CategoryId { get; set; }
        public string ImageUrl { get; set; }
    }

    public class ProductReadDto
    {
        public int Id { get; set; }
        public string ProductTitle { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string BrandName { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ProductImageDto> Images { get; set; } = new();
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}