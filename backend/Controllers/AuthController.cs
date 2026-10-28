using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Đăng ký: gửi request tới admin
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RequestRegister req)
        {
            if (await _context.Users.AnyAsync(u => u.Username == req.Username))
                return BadRequest("Username đã tồn tại trên hệ thống");
            if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password) || string.IsNullOrEmpty(req.Role))
                return BadRequest("Thông tin đăng ký không hợp lệ");
            if (await _context.RequestRegisters.AnyAsync(r => r.Username == req.Username && !r.IsApproved))
                return BadRequest("Bạn đã gửi yêu cầu đăng ký trước đó, vui lòng chờ admin duyệt");

            // Không mã hóa mật khẩu nữa
            _context.RequestRegisters.Add(req);
            await _context.SaveChangesAsync();
            return Ok("Đã gửi yêu cầu đăng ký, vui lòng chờ admin duyệt");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Models.LoginRequest login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);
            if (user == null)
                return Unauthorized("Tài khoản không tồn tại");
            if (!user.IsActive)
                return Unauthorized("Tài khoản chưa được duyệt bởi admin");
            if (user.Password != login.Password)
                return Unauthorized("Mật khẩu không chính xác");
            if (string.IsNullOrEmpty(user.Password))
                return Unauthorized("Mật khẩu không được để trống");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "supersecretkey");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username ?? string.Empty),
                    new Claim(ClaimTypes.Role, user.Role ?? string.Empty)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token), role = user.Role });
        }
    }
    // DTO cho login

}
