using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizApp.API.Data;
using QuizApp.API.DTOs;
using QuizApp.API.Models;
using QuizApp.API.Repositories;

namespace QuizApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly IRepository<Question> _repo;
        private readonly IRepository<Quiz> _quizRepo;
        private readonly ApplicationDbContext _context;

        public QuestionController(IRepository<Question> repo, IRepository<Quiz> quizRepo,ApplicationDbContext context)
        {
            _repo = repo;
            _quizRepo = quizRepo;
            _context = context;
        }

        [HttpGet("byquiz/{quizId:int}")]
        public async Task<IActionResult> GetByQuiz(int quizId)
        {
            var quiz = await _quizRepo.GetByIdAsync(quizId);
            if (quiz == null)
                return NotFound("Quiz not found");

            var questions = await _context.Questions
                .Where(q => q.QuizId == quizId)
                .Include(q => q.AnswerOptions)
                .Select(q => new QuestionReadDto
                {
                    Id = q.Id,
                    QuizId = q.QuizId,
                    QuestionText = q.QuestionText,
                    Points = q.Points,
                    AnswerOptions = q.AnswerOptions.Select(a => new AnswerOptionReadDto
                    {
                        Id = a.Id,
                        Text = a.OptionText,
                        IsCorrect = a.IsCorrect,
                        QuestionId = a.QuestionId
                    }).ToList()
                })
                .ToListAsync();

            return Ok(questions);
        }


        [HttpGet("by-quiz/{quizId}")]
        public async Task<IActionResult> ByQuiz(int quizId)
        {
            var questions = await _context.Questions
                .Where(q => q.QuizId == quizId)
                .ToListAsync();
            return Ok(questions);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuestionCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var quiz = await _quizRepo.GetByIdAsync(dto.QuizId);
            if (quiz == null) return BadRequest("Quiz does not exist");

            var q = new Question
            {
                QuizId = dto.QuizId,
                QuestionText = dto.QuestionText,
                Points = dto.Points
            };
            var created = await _repo.AddAsync(q);
            return Ok(created);

        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] QuestionCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.QuestionText = dto.QuestionText;
            existing.Points = dto.Points;
            // if quizId changed, verify
            if (existing.QuizId != dto.QuizId)
            {
                var quiz = await _quizRepo.GetByIdAsync(dto.QuizId);
                if (quiz == null) return BadRequest("Target quiz does not exist");
                existing.QuizId = dto.QuizId;
            }

            await _repo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound();

            return Ok(new { message = "Question deleted successfully" }); // ✅
        }




        // ✅ Get all questions with Quiz Title
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var questions = await _context.Questions
                .Include(q => q.Quiz)
                .Select(q => new
                {
                    q.Id,
                    q.QuizId,
                    QuizTitle = q.Quiz.Title,
                    q.QuestionText
                })
                .ToListAsync();

            return Ok(questions);
        }

        
        // ✅ Get single question
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound();

            return Ok(question);
        }
    }
}
