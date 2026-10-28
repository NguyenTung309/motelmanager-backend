using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.OData;

[Route("odata/MotelRooms")]
public class MotelRoomsODataController : ODataController
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public MotelRoomsODataController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [EnableQuery(PageSize = 20)]
    [HttpGet]
    public IQueryable<MotelRoomReadDto> Get()
    {
        return _context.MotelRooms
            .AsNoTracking()
            .OrderByDescending(m => m.Id)
            .ProjectTo<MotelRoomReadDto>(_mapper.ConfigurationProvider);
    }
}
