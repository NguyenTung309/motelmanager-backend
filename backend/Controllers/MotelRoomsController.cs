using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MotelRoomsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MotelRoomsController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả phòng trọ (cho mọi user)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _context.MotelRooms.Include(m => m.Owner).ToListAsync();
            return Ok(rooms);
        }

        // Tìm kiếm phòng trọ theo quận hoặc khoảng giá
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? district, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var query = _context.MotelRooms.Include(m => m.Owner).AsQueryable();
            if (!string.IsNullOrEmpty(district))
                query = query.Where(m => m.Address != null && m.Address.Contains(district));
            if (minPrice.HasValue)
                query = query.Where(m => m.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(m => m.Price <= maxPrice.Value);
            return Ok(await query.ToListAsync());
        }

        // Xem chi tiết phòng trọ
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var room = await _context.MotelRooms.Include(m => m.Owner).FirstOrDefaultAsync(m => m.Id == id);
            if (room == null) return NotFound();
            return Ok(room);
        }
        // Lấy danh sách phòng trọ của owner hiện tại
        [Authorize(Roles = "owner")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRooms()
        {
            var username = User.Identity?.Name;
            var owner = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Role == "owner");
            if (owner == null) return Unauthorized();
            var rooms = await _context.MotelRooms.Where(m => m.OwnerId == owner.Id).ToListAsync();
            return Ok(rooms);
        }

        // Chủ trọ đăng bài
        [Authorize(Roles = "owner")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MotelRoom room)
        {
            var username = User.Identity?.Name;
            var owner = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Role == "owner");
            if (owner == null) return Unauthorized();
            room.OwnerId = owner.Id;
            _context.MotelRooms.Add(room);
            await _context.SaveChangesAsync();
            return Ok(room);
        }

        // Chủ trọ sửa bài
        [Authorize(Roles = "owner")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MotelRoom room)
        {
            var username = User.Identity?.Name;
            var owner = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Role == "owner");
            if (owner == null) return Unauthorized();
            var existing = await _context.MotelRooms.FirstOrDefaultAsync(m => m.Id == id && m.OwnerId == owner.Id);
            if (existing == null) return NotFound();
            existing.Title = room.Title;
            existing.Address = room.Address;
            existing.Price = room.Price;
            existing.Description = room.Description;
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // Chủ trọ xóa bài
        [Authorize(Roles = "owner")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var username = User.Identity?.Name;
            var owner = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Role == "owner");
            if (owner == null) return Unauthorized();
            var room = await _context.MotelRooms.FirstOrDefaultAsync(m => m.Id == id && m.OwnerId == owner.Id);
            if (room == null) return NotFound();
            _context.MotelRooms.Remove(room);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
