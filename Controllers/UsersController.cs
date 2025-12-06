using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebFashion.Data;
using WebFashion.DTOs;
using WebFashion.Models;

namespace WebFashion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        public UsersController(ApplicationDbContext context,IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetUserId()
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserProfile(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound(new { message = "User not found" });

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, [FromBody] UpdateUserProfileDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Only allow users to update their own profile (unless they're admin)
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim != id.ToString() && !User.IsInRole("Admin"))
                return Forbid();

            user.FirstName = dto.FirstName ?? user.FirstName;
            user.LastName = dto.LastName ?? user.LastName;
            user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

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

        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Only allow users to change their own password (unless they're admin)
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim != id.ToString() && !User.IsInRole("Admin"))
                return Forbid();

            // Verify old password
            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect" });

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }
    
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            if (userId == 0) 
                return Unauthorized(new { message = "User not found in token" });
            
            var data = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
            if (data == null)
                return NotFound(new { message = "User not found" });

            return Ok(new UserDto
            {
                Id = data.Id,
                FirstName = data.FirstName,
                LastName = data.LastName,
                Email = data.Email,
                PhoneNumber = data.PhoneNumber,
                Role = (int)data.Role,
                CreatedAt = data.CreatedAt
            });
        }
      
    }
}
