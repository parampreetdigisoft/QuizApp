using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace QuizApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(new { user.UserId, user.UserName, user.Email, user.Role });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] RegisterRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.UserName = request.Username;
            user.Email = request.Email;
            user.Role = request.Role;

            if (!string.IsNullOrEmpty(request.Password))
                user.PasswordHash = ComputeSha256Hash(request.Password);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User deleted successfully" });
        }

        // ✅ Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == request.Username))
                return BadRequest("Username already exists.");

            var user = new User
            {
                UserName = request.Username,
                Email = request.Email,
                Role = request.Role,
                PasswordHash = ComputeSha256Hash(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();  

            return Ok(new { Message = "User registered successfully" });
        }

        // ✅ Login user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username);
            if (user == null)
                return Unauthorized("Invalid username or password");

            var hashedPassword = ComputeSha256Hash(request.Password);
            if (hashedPassword != user.PasswordHash)
                return Unauthorized("Invalid username or password");

            return Ok(new { user = user });
        }

        // ✅ Helper - Simple SHA256 hashing
        private string ComputeSha256Hash(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            var builder = new StringBuilder();
            foreach (var b in bytes)
                builder.Append(b.ToString("x2"));
            return builder.ToString();
        }
    }

    // DTOs for request models
    public class RegisterRequest
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;

        public string Password { get; set; } = null!;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
