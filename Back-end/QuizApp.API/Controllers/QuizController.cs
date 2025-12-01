using Microsoft.AspNetCore.Mvc;
using QuizApp.API.DTOs;
using QuizApp.API.Models;
using QuizApp.API.Repositories;

namespace QuizApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IRepository<Quiz> _repo;
        
        public QuizController(IRepository<Quiz> repo)
        {
            _repo = repo;
        }
        [HttpGet("byuser/{userId:int}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var allAttempts = await _repo.GetAllAsync();
            var attempts = allAttempts
                .Where(a => a.CreatedBy == userId)
                .OrderByDescending(a => a.CreatedAt)
                .ToList();

            return Ok(attempts);
        }


        [HttpGet("all")]
        public async Task<IActionResult> All()
       {
            var quizzes = await _repo.GetAllAsync();
            // map to read DTOs
            var result = quizzes.Select(q => new QuizReadDto
            {
                QuizId = q.QuizId,
                Title = q.Title,
                Description = q.Description,
                TimeAllowed = q.TimeAllowed,
               CreatedAt = q.CreatedAt,
                IsActive = q.IsActive
            });
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var quizzes = await _repo.GetAllAsync();
            // map to read DTOs
            var result = quizzes.Select(q => new QuizReadDto
            {
                QuizId = q.QuizId,
                Title = q.Title,
                Description = q.Description,
                TimeAllowed = q.TimeAllowed,
                IsActive = q.IsActive
            });
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var quiz = await _repo.GetByIdAsync(id);
            if (quiz == null) return NotFound();
            var dto = new QuizReadDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeAllowed = quiz.TimeAllowed,
                IsActive = quiz.IsActive
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuizCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                IsActive = dto.IsActive,
                TimeAllowed = dto.TimeAllowed,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repo.AddAsync(quiz);
            return CreatedAtAction(nameof(Get), new { id = created.QuizId }, new { created.QuizId });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] QuizCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.IsActive = dto.IsActive;
            existing.TimeAllowed = dto.TimeAllowed;

            await _repo.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
