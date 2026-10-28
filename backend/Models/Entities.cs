using System.ComponentModel.DataAnnotations;

namespace backend.Models
{

    public class User
    {
        public int Id { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? Role { get; set; } // "student", "owner", "admin"
        public bool IsActive { get; set; } = false; // Chỉ admin duyệt mới active
    }
    public class LoginRequest
{
    [Required]
    public string? Username { get; set; }
    [Required]
    public string? Password { get; set; }
}

    public class RequestRegister
    {
        public int Id { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? Role { get; set; } // "student" hoặc "owner"
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class MotelRoom
    {
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
    }
}
