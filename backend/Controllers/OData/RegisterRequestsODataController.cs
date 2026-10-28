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
[Route("odata/RegisterRequests")]
public class RegisterRequestsODataController : ODataController
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public RegisterRequestsODataController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [EnableQuery(PageSize = 20)]
    [HttpGet]
    public IQueryable<RegisterRequestReadDto> Get()
    {
        return _context.RequestRegisters
            .AsNoTracking()
            .OrderByDescending(r => r.CreatedAt)
            .ProjectTo<RegisterRequestReadDto>(_mapper.ConfigurationProvider);
    }
}
