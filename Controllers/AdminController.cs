using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebFashion.Data;
using WebFashion.DTOs;
using WebFashion.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebFashion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // User Management
        [HttpGet("users")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Role = (int)u.Role,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound();

            return Ok(new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = (int)user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Role = (UserRole)dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound();

            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Category Management
        [HttpGet("categories")]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("categories")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllCategories), new { id = category.Id }, category);
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = dto.Name;
            category.Description = dto.Description;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Product Images Management
        [HttpPost("products/{productId}/images")]
        public async Task<ActionResult<ProductImageDto>> AddProductImage(int productId, [FromBody] ProductImageDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);
            if (product == null)
                return NotFound("Product not found");

            var image = new ProductImage
            {
                ProductId = productId,
                ImageUrl = dto.ImageUrl,
                DisplayOrder = dto.DisplayOrder
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(AddProductImage), new { productId }, image);
        }

        // Product Management
        [HttpPost("products")]
        public async Task<IActionResult> CreateProducts([FromBody] ProductCreateDto dto)
        {
            var product = new Product
            {
                ProductTitle = dto.ProductTitle, 
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                BrandName = dto.BrandName,
                CategoryId = dto.CategoryId,
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = dto.ImageUrl.ImageUrl,
                        DisplayOrder = dto.ImageUrl.DisplayOrder
                    }
                }
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet("products")]
        public async Task<ActionResult<object>> GetProducts([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            var totalProducts = await _context.Products.Where(p => !p.IsDeleted).CountAsync();
            var totalPages = (int)Math.Ceiling(totalProducts / (double)perPage);

            var products = await _context.Products
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .Include(p => p.Images)
                .Select(p => new
                {
                    p.Id,
                    p.ProductTitle,
                    p.Description,
                    p.Price,
                    p.Quantity,
                    p.BrandName,
                    p.CategoryId,
                    Images = p.Images.Select(i => new { i.Id, i.ImageUrl, i.DisplayOrder }).ToList()
                })
                .ToListAsync();

            return Ok(new { items = products, totalPages, page, perPage });
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto dto)
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

            if (!string.IsNullOrEmpty(dto.ImageUrl.ImageUrl))
            {
                var existingImage = product.Images.FirstOrDefault();
                if (existingImage != null)
                {
                    existingImage.ImageUrl = dto.ImageUrl.ImageUrl;
                    existingImage.DisplayOrder = dto.ImageUrl.DisplayOrder;
                }
                else
                {
                    product.Images.Add(new ProductImage
                    {
                        ImageUrl = dto.ImageUrl.ImageUrl,
                        DisplayOrder = dto.ImageUrl.DisplayOrder
                    });
                }
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("products/{id}")]
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

        [HttpDelete("products/{productId}/images/{imageId}")]
        public async Task<IActionResult> DeleteProductImage(int productId, int imageId)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
                return NotFound();

            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Dashboard Statistics
        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            var totalUsers = await _context.Users.Where(u => !u.IsDeleted).CountAsync();
            var totalProducts = await _context.Products.Where(p => !p.IsDeleted).CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed)
                .SumAsync(o => o.TotalAmount);

            var now = DateTime.UtcNow;
            
            var currentMonthStart = new DateTime(now.Year, now.Month, 1,0,0,0,DateTimeKind.Utc);
            var previousMonthStart = currentMonthStart.AddMonths(-1);
            var previousMonthEnd = currentMonthStart.AddSeconds(-1);

            var revenueThisMonth = await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= currentMonthStart)
                .SumAsync(o => o.TotalAmount);

            var revenuePreviousMonth = await _context.Orders
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= previousMonthStart && o.CreatedAt <= previousMonthEnd)
                .SumAsync(o => o.TotalAmount);

            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    o.TotalAmount,
                    o.Status,
                    o.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                revenueThisMonth,
                revenuePreviousMonth,
                recentOrders
            });
        }

        // Order Management
        [HttpGet("orders")]
        public async Task<ActionResult> GetAllOrders([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            var totalOrders = await _context.Orders.CountAsync();
            var totalPages = (int)Math.Ceiling(totalOrders / (double)perPage);

            var orders = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .ToListAsync();

            var result = orders.Select(order => new OrderReadDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString(),
                PaymentMethod = order.PaymentMethod,
                CreatedAt = order.CreatedAt
            }).ToList();

            // 👇 Trả về dữ liệu có cấu trúc đúng với frontend
            return Ok(new
            {
                items = result,
                totalPages = totalPages,
                currentPage = page
            });
        }


        [HttpPatch("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto statusUpdate)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(statusUpdate.Status)) 
                return BadRequest("Status cannot be empty");

            if (Enum.TryParse<OrderStatus>(statusUpdate.Status, out var newStatus))
            {
                order.Status = newStatus;
                order.UpdatedAt = DateTime.UtcNow;
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return BadRequest("Invalid status value");
        }
    }
}
