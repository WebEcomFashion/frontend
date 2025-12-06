using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebFashion.Data;
using WebFashion.DTOs;
using WebFashion.Models;

namespace WebFashion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetProducts([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            var totalProducts = await _context.Products.Where(p => !p.IsDeleted).CountAsync();
            var totalPages = (int)Math.Ceiling(totalProducts / (double)perPage);

            var products = await _context.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Images)
                .OrderByDescending(p => p.CreatedAt) // ✅ Thêm dòng này
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .Select(p => new ProductReadDto
                {
                    Id = p.Id,
                    ProductTitle = p.ProductTitle,
                    Description = p.Description,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    BrandName = p.BrandName,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    Images = p.Images.Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ImageUrl = i.ImageUrl,
                        DisplayOrder = i.DisplayOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new { items = products, totalPages, page, perPage });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(new ProductReadDto
            {
                Id = product.Id,
                ProductTitle = product.ProductTitle,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                BrandName = product.BrandName,
                CategoryId = product.CategoryId,
                CreatedAt = product.CreatedAt,
                Images = product.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    DisplayOrder = i.DisplayOrder
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromBody] ProductCreateDto dto)
        {
            var product = new Product
            {
                ProductTitle = dto.ProductTitle,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                BrandName = dto.BrandName,
                CategoryId = dto.CategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            if (dto.ImageUrl != null && !string.IsNullOrEmpty(dto.ImageUrl.ImageUrl))
            {
                var image = new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = dto.ImageUrl.ImageUrl,
                    DisplayOrder = dto.ImageUrl.DisplayOrder
                };
                _context.ProductImages.Add(image);
                await _context.SaveChangesAsync();
            }
            
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto dto)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            if (product == null)
                return NotFound();

            product.ProductTitle = dto.ProductTitle;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Quantity = dto.Quantity;
            product.BrandName = dto.BrandName;
            product.CategoryId = dto.CategoryId;
            product.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                var existingImage = product.Images.FirstOrDefault();
                if (existingImage != null)
                {
                    existingImage.ImageUrl = dto.ImageUrl;
                    _context.ProductImages.Update(existingImage);
                }
                else
                {
                    var newImage = new ProductImage
                    {
                        ProductId = id,
                        ImageUrl = dto.ImageUrl,
                        DisplayOrder = 0
                    };
                    _context.ProductImages.Add(newImage);
                }
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
            if (product == null)
                return NotFound();

            product.IsDeleted = true;
            product.UpdatedAt = DateTime.UtcNow;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("best-sellers")]
        public async Task<ActionResult<object>> GetBestSellers([FromQuery] int limit = 4)
        {
            var bestSellers = await _context.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Images)
                .Include(p => p.OrderItems) // Include OrderItems to count orders
                .OrderByDescending(p => p.OrderItems.Count) // Order by quantity ordered
                .Take(limit)
                .Select(p => new ProductReadDto
                {
                    Id = p.Id,
                    ProductTitle = p.ProductTitle,
                    Description = p.Description,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    BrandName = p.BrandName,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    Images = p.Images.Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ImageUrl = i.ImageUrl,
                        DisplayOrder = i.DisplayOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new { items = bestSellers });
        }
    }
}
