using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebFashion.Data;
using WebFashion.DTOs;
using WebFashion.Models;
using System.Linq; // Cần thiết cho Skip/Take

namespace WebFashion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<OrderReadDto>> CreateOrder([FromBody] OrderCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Order data is required.");

            var order = new Order
            {
                UserId = dto.UserId,
                TotalAmount = dto.TotalAmount,
                ShippingAddress = JsonSerializer.Serialize(dto.ShippingAddress),
                PaymentMethod = dto.PaymentMethod,
                Status = OrderStatus.Pending
            };

            foreach (var item in dto.Items)
            {
                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductTitle = item.ProductTitle,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Size = item.Size,
                    Color = item.Color
                });
            }

            try
            {
                _context.Orders.Add(order); 
                await _context.SaveChangesAsync();

                var orderRead = MapToReadDto(order);

                return Ok(orderRead);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateOrder] Error: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // ===================================================
        // SỬA: GET ALL ORDERS WITH PAGINATION (Cho Admin/API)
        // Endpoint: GET /api/orders?page=X&perPage=Y
        // ===================================================
        [HttpGet]
        public async Task<ActionResult<object>> GetAllOrders([FromQuery] int page = 1, [FromQuery] int perPage = 10)
        {
            if (page < 1) page = 1;
            if (perPage < 1) perPage = 10;
            
            // 1. Lấy tổng số lượng đơn hàng
            var totalOrders = await _context.Orders.CountAsync();
            // 2. Tính tổng số trang
            var totalPages = (int)Math.Ceiling(totalOrders / (double)perPage);
            
            // 3. Phân trang và lấy dữ liệu
            var orders = await _context.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt) // Sắp xếp theo ngày tạo mới nhất
                .Skip((page - 1) * perPage) 
                .Take(perPage)
                .ToListAsync();

            var orderDtos = orders.Select(MapToReadDto).ToList();

            // 4. Trả về object có items và totalPages, giống như ProductsController
            return Ok(new 
            { 
                items = orderDtos, 
                totalCount = totalOrders, 
                totalPages, 
                page, 
                perPage 
            });
        }
        // ===================================================

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderReadDto>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(MapToReadDto(order));
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<OrderReadDto>>> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ToListAsync();

            var result = orders.Select(MapToReadDto).ToList();
            return Ok(result);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto statusUpdate)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();
            
            if (Enum.TryParse<OrderStatus>(statusUpdate.Status, out var newStatus))
            {
                order.Status = newStatus;
                order.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return BadRequest("Invalid status");
        }

        // =======================
        // Mapping entity → DTO
        // =======================
        private OrderReadDto MapToReadDto(Order order)
        {
            var shippingAddress = JsonSerializer.Deserialize<ShippingAddressDto>(order.ShippingAddress);

            return new OrderReadDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString(),
                ShippingAddress = shippingAddress,
                PaymentMethod = order.PaymentMethod,
                PaymentId = order.PaymentId,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductTitle = i.ProductTitle,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Size = i.Size,
                    Color = i.Color
                }).ToList()
            };
        }
    }
}   