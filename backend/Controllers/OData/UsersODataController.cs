using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.OData;

[Authorize(Roles = "admin")]
[Route("odata/Users")]
public class UsersODataController : ODataController
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public UsersODataController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [EnableQuery(PageSize = 20)]
    [HttpGet]
    public IQueryable<UserReadDto> Get()
    {
        return _context.Users
            .AsNoTracking()
            .OrderBy(u => u.Username)
            .ProjectTo<UserReadDto>(_mapper.ConfigurationProvider);
    }
}
