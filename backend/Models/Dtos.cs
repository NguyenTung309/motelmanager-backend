using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class LoginRequestDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequestCreateDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(student|owner)$", ErrorMessage = "Role must be student or owner.")]
    public string Role { get; set; } = string.Empty;
}

public class MotelRoomUpsertDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Address { get; set; } = string.Empty;

    [Range(typeof(decimal), "1000", "1000000000", ErrorMessage = "Price must be at least 1000.")]
    public decimal Price { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }
}

public class OwnerSummaryDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class MotelRoomReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public int OwnerId { get; set; }
    public OwnerSummaryDto? Owner { get; set; }
}

public class UserReadDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class RegisterRequestReadDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class ApiMessageDto
{
    public string Message { get; set; } = string.Empty;
}
