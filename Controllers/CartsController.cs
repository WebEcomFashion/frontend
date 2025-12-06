using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebFashion.Data;
using WebFashion.DTOs;
using WebFashion.Models;

namespace WebFashion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{cartId}")]
        public async Task<ActionResult<CartDto>> GetCart(int cartId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart == null)
                return NotFound();

            var items = cart.Items.Select(ci => new CartItemReadDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductTitle = _context.Products.FirstOrDefault(p => p.Id == ci.ProductId)?.ProductTitle,
                Quantity = ci.Quantity,
                Size = ci.Size,
                Color = ci.Color,
                UnitPrice = ci.UnitPrice
            }).ToList();

            return Ok(new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                TotalPrice = cart.TotalPrice,
                Items = items
            });
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> CreateCart([FromBody] CartCreateDto dto)
        {
            var cart = new Cart { UserId = dto.UserId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCart), new { cartId = cart.Id }, cart);
        }

        [HttpPut("{cartId}")]
        public async Task<IActionResult> UpdateCart(int cartId, [FromBody] CartUpdateDto dto)
        {
            var cart = await _context.Carts.FindAsync(cartId);
            if (cart == null)
                return NotFound();

            cart.TotalPrice = dto.TotalPrice;
            cart.UpdatedAt = DateTime.UtcNow;

            _context.Carts.Update(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{cartId}")]
        public async Task<IActionResult> DeleteCart(int cartId)
        {
            var cart = await _context.Carts.FindAsync(cartId);
            if (cart == null)
                return NotFound();

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{cartId}/items")]
        public async Task<IActionResult> AddCartItem(int cartId, [FromBody] CartItemDto dto)
        {
            var cart = await _context.Carts.FindAsync(cartId);
            if (cart == null)
                return NotFound();

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return BadRequest("Product not found");

            var cartItem = new CartItem
            {
                CartId = cartId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Size = dto.Size,
                Color = dto.Color,
                UnitPrice = product.Price
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }
    }
}
