using AutoMapper;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly IPasswordService _passwordService;

    public AuthController(
        AppDbContext context,
        IConfiguration config,
        IMapper mapper,
        IPasswordService passwordService)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
        _passwordService = passwordService;
    }

    [HttpPost("register")]
    [Consumes("application/json", "application/xml")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<ApiMessageDto>> Register([FromBody] RegisterRequestCreateDto requestDto)
    {
        var username = requestDto.Username.Trim();
        var role = requestDto.Role.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return BadRequest(new ApiMessageDto { Message = "Username da ton tai tren he thong." });
        }

        if (await _context.RequestRegisters.AnyAsync(r => r.Username == username && !r.IsApproved))
        {
            return BadRequest(new ApiMessageDto { Message = "Ban da gui yeu cau dang ky truoc do, vui long cho admin duyet." });
        }

        var request = _mapper.Map<RequestRegister>(requestDto);
        request.Username = username;
        request.Role = role;
        request.Password = _passwordService.Hash(requestDto.Password);

        _context.RequestRegisters.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new ApiMessageDto { Message = "Da gui yeu cau dang ky, vui long cho admin duyet." });
    }

    [HttpPost("login")]
    [Consumes("application/json", "application/xml")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto login)
    {
        var username = login.Username.Trim();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return Unauthorized(new ApiMessageDto { Message = "Tai khoan khong ton tai." });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new ApiMessageDto { Message = "Tai khoan chua duoc duyet boi admin." });
        }

        if (!_passwordService.Verify(login.Password, user.Password))
        {
            return Unauthorized(new ApiMessageDto { Message = "Mat khau khong chinh xac." });
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "supersecretkey");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new AuthResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            Role = user.Role
        });
    }
}
