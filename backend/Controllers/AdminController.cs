using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPasswordService _passwordService;

    public AdminController(AppDbContext context, IMapper mapper, IPasswordService passwordService)
    {
        _context = context;
        _mapper = mapper;
        _passwordService = passwordService;
    }

    [HttpGet("users")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<IEnumerable<UserReadDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .OrderBy(u => u.Username)
            .ProjectTo<UserReadDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("register-requests")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<IEnumerable<RegisterRequestReadDto>>> GetRegisterRequests()
    {
        var requests = await _context.RequestRegisters
            .AsNoTracking()
            .Where(r => !r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .ProjectTo<RegisterRequestReadDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPost("approve/{requestId}")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<ApiMessageDto>> ApproveRegister(int requestId)
    {
        var request = await _context.RequestRegisters.FirstOrDefaultAsync(r => r.Id == requestId && !r.IsApproved);

        if (request == null)
        {
            return NotFound(new ApiMessageDto { Message = "Khong tim thay yeu cau dang ky." });
        }

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest(new ApiMessageDto { Message = "Username da ton tai, khong the duyet lai." });
        }

        var password = request.Password.StartsWith("$2", StringComparison.Ordinal)
            ? request.Password
            : _passwordService.Hash(request.Password);

        _context.Users.Add(new User
        {
            Username = request.Username,
            Password = password,
            Role = request.Role,
            IsActive = true
        });

        request.IsApproved = true;
        await _context.SaveChangesAsync();

        return Ok(new ApiMessageDto { Message = "Da duyet tai khoan thanh cong." });
    }
}
