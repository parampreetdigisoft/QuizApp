using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.Models;
using QuizApp.API.Repositories;

namespace QuizApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizAttemptController : ControllerBase
    {
        private readonly IRepository<QuizAttempt> _attemptRepo;
        private readonly IRepository<UserAnswer> _answerRepo;
        private readonly ApplicationDbContext _context;
        public QuizAttemptController(IRepository<QuizAttempt> attemptRepo, IRepository<UserAnswer> answerRepo, ApplicationDbContext context)
        {
            _attemptRepo = attemptRepo;
            _answerRepo = answerRepo;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SaveAttempt([FromBody] QuizAttemptDto attemptDto)
        {
            if (attemptDto == null) return BadRequest("Invalid data");

            var entity = new QuizAttempt
            {
                QuizId = attemptDto.QuizId,
                UserId = attemptDto.UserId,
                AttemptedAt = DateTime.UtcNow,
                Score = attemptDto.Score,
                TotalQuestions = attemptDto.TotalQuestions,
                Answers = attemptDto.Answers?.Select(a => new UserAnswer
                {
                    QuestionId = a.QuestionId,
                    SelectedOptionId = a.SelectedOptionId,
                    IsCorrect = a.IsCorrect,
                    UserId = attemptDto.UserId
                }).ToList()
            };

            await _attemptRepo.AddAsync(entity);

            return Ok(new { message = "Attempt saved", attemptId = entity.Id });
        }

        //[HttpPost]
        //public async Task<IActionResult> SaveAttempt([FromBody] QuizAttemptDto attempt)
        //{
        //    if (attempt == null) return BadRequest("Invalid data");

        //    await _attemptRepo.AddAsync(attempt);
        //    return Ok(attempt);
        //}

        [HttpGet("byuser/{userId}")]
        public async Task<IActionResult> GetUserAttempts(int userId)
        {
            var all = await _attemptRepo.GetAllAsync();
            var userAttempts = all.Where(a => a.UserId == userId);
            return Ok(userAttempts);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var all = await _attemptRepo.GetAllAsync();
            return Ok(all);
        }

        [HttpGet("allattempts")]
        public async Task<IActionResult> GetAllAttempts()
        {
            var data = await _context.QuizAttempts
                .Include(a => a.User)
                .Select(a => new
                {
                    a.Id,
                    a.QuizId,
                    a.UserId,
                    UserName = a.User.UserName, // ✅ joined field
                    a.Score,
                    a.AttemptedAt
                })
                .ToListAsync();

            return Ok(data);
        }

    }
}
