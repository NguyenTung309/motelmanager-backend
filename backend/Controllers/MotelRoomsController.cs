using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotelRoomsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public MotelRoomsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<IEnumerable<MotelRoomReadDto>>> GetAll()
    {
        var rooms = await _context.MotelRooms
            .AsNoTracking()
            .OrderByDescending(m => m.Id)
            .ProjectTo<MotelRoomReadDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("search")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<IEnumerable<MotelRoomReadDto>>> Search(
        [FromQuery] string? district,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var query = _context.MotelRooms.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(m => m.Address.Contains(district));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(m => m.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(m => m.Price <= maxPrice.Value);
        }

        var rooms = await query
            .OrderByDescending(m => m.Id)
            .ProjectTo<MotelRoomReadDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("{id}")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<MotelRoomReadDto>> GetDetail(int id)
    {
        var room = await _context.MotelRooms
            .AsNoTracking()
            .Where(m => m.Id == id)
            .ProjectTo<MotelRoomReadDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (room == null)
        {
            return NotFound(new ApiMessageDto { Message = "Khong tim thay phong tro." });
        }

        return Ok(room);
    }

    [Authorize(Roles = "owner")]
    [HttpGet("my")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<IEnumerable<MotelRoomReadDto>>> GetMyRooms()
    {
        var owner = await GetCurrentOwnerAsync();

        if (owner == null)
        {
            return Unauthorized(new ApiMessageDto { Message = "Ban can dang nhap bang tai khoan chu tro." });
        }

        var rooms = await _context.MotelRooms
            .AsNoTracking()
            .Where(m => m.OwnerId == owner.Id)
            .OrderByDescending(m => m.Id)
            .ProjectTo<MotelRoomReadDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(rooms);
    }

    [Authorize(Roles = "owner")]
    [HttpPost]
    [Consumes("application/json", "application/xml")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<MotelRoomReadDto>> Create([FromBody] MotelRoomUpsertDto roomDto)
    {
        var owner = await GetCurrentOwnerAsync();

        if (owner == null)
        {
            return Unauthorized(new ApiMessageDto { Message = "Ban can dang nhap bang tai khoan chu tro." });
        }

        var room = _mapper.Map<MotelRoom>(roomDto);
        room.OwnerId = owner.Id;
        room.Owner = owner;

        _context.MotelRooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDetail), new { id = room.Id }, _mapper.Map<MotelRoomReadDto>(room));
    }

    [Authorize(Roles = "owner")]
    [HttpPut("{id}")]
    [Consumes("application/json", "application/xml")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<MotelRoomReadDto>> Update(int id, [FromBody] MotelRoomUpsertDto roomDto)
    {
        var owner = await GetCurrentOwnerAsync();

        if (owner == null)
        {
            return Unauthorized(new ApiMessageDto { Message = "Ban can dang nhap bang tai khoan chu tro." });
        }

        var existing = await _context.MotelRooms.FirstOrDefaultAsync(m => m.Id == id && m.OwnerId == owner.Id);

        if (existing == null)
        {
            return NotFound(new ApiMessageDto { Message = "Khong tim thay bai dang cua ban." });
        }

        _mapper.Map(roomDto, existing);
        existing.Owner = owner;

        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<MotelRoomReadDto>(existing));
    }

    [Authorize(Roles = "owner")]
    [HttpDelete("{id}")]
    [Produces("application/json", "application/xml")]
    public async Task<ActionResult<ApiMessageDto>> Delete(int id)
    {
        var owner = await GetCurrentOwnerAsync();

        if (owner == null)
        {
            return Unauthorized(new ApiMessageDto { Message = "Ban can dang nhap bang tai khoan chu tro." });
        }

        var room = await _context.MotelRooms.FirstOrDefaultAsync(m => m.Id == id && m.OwnerId == owner.Id);

        if (room == null)
        {
            return NotFound(new ApiMessageDto { Message = "Khong tim thay bai dang de xoa." });
        }

        _context.MotelRooms.Remove(room);
        await _context.SaveChangesAsync();

        return Ok(new ApiMessageDto { Message = "Da xoa phong tro thanh cong." });
    }

    private async Task<User?> GetCurrentOwnerAsync()
    {
        var username = User.Identity?.Name;

        if (string.IsNullOrWhiteSpace(username))
        {
            return null;
        }

        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Role == "owner");
    }
}
