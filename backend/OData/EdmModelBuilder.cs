using backend.Models;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace backend.OData;

public static class EdmModelBuilder
{
    public static IEdmModel GetEdmModel()
    {
        var builder = new ODataConventionModelBuilder();
        builder.EntitySet<MotelRoomReadDto>("MotelRooms");
        builder.EntitySet<UserReadDto>("Users");
        builder.EntitySet<RegisterRequestReadDto>("RegisterRequests");

        return builder.GetEdmModel();
    }
}
