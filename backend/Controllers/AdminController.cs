using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả user
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // Lấy danh sách request đăng ký chưa duyệt
        [HttpGet("register-requests")]
        public async Task<IActionResult> GetRegisterRequests()
        {
            var requests = await _context.RequestRegisters.Where(r => !r.IsApproved).ToListAsync();
            return Ok(requests);
        }

        // Duyệt request đăng ký
        [HttpPost("approve/{requestId}")]
        public async Task<IActionResult> ApproveRegister(int requestId)
        {
            var req = await _context.RequestRegisters.FirstOrDefaultAsync(r => r.Id == requestId && !r.IsApproved);
            if (req == null) return NotFound();
            // Tạo user mới
            var user = new User
            {
                Username = req.Username,
                Password = req.Password,
                Role = req.Role,
                IsActive = true
            };
            _context.Users.Add(user);
            req.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok("Đã duyệt tài khoản thành công");
        }
    }
}
