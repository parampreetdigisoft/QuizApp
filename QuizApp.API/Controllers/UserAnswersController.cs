using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.Models;

namespace QuizApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAnswersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserAnswersController(ApplicationDbContext context) => _context = context;

        [HttpGet("all")]
        public async Task<IActionResult> GetAnswers()
        {
            var list = await _context.UserAnswers.ToListAsync();
            return Ok(list);
        }


        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAnswers([FromBody] List<UserAnswer> answers)
        {
            if (answers == null || !answers.Any())
                return BadRequest("No answers provided");

            await _context.UserAnswers.AddRangeAsync(answers);
            await _context.SaveChangesAsync();

            // Optional: calculate score
            int correctCount = 0;
            foreach (var a in answers)
            {
                var correct = await _context.AnswerOptions
                    .Where(opt => opt.Id == a.SelectedOptionId && opt.IsCorrect)
                    .AnyAsync();

                if (correct) correctCount++;
            }

            return Ok(new { Score = correctCount, Message = "Quiz submitted successfully" });
        }
    
    }

}
