using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(student|owner|admin)$", ErrorMessage = "Role must be student, owner, or admin.")]
    public string Role { get; set; } = string.Empty;

    public bool IsActive { get; set; } = false;
}

public class RequestRegister
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(student|owner)$", ErrorMessage = "Role must be student or owner.")]
    public string Role { get; set; } = string.Empty;

    public bool IsApproved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class MotelRoom
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Range(typeof(decimal), "1000", "1000000000", ErrorMessage = "Price must be at least 1000.")]
    public decimal Price { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public int OwnerId { get; set; }
    public User? Owner { get; set; }
}
