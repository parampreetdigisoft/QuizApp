using Microsoft.AspNetCore.Mvc;
using QuizApp.API.DTOs;
using QuizApp.API.Models;
using QuizApp.API.Repositories;

namespace QuizApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnswerOptionController : ControllerBase
    {
        private readonly IRepository<AnswerOption> _repo;
        private readonly IRepository<Question> _questionRepo;

        public AnswerOptionController(IRepository<AnswerOption> repo, IRepository<Question> questionRepo)
        {
            _repo = repo;
            _questionRepo = questionRepo;
        }


        [HttpGet("by-question/{questionId:int}")]
        public async Task<IActionResult> GetByQuestion(int questionId)
        {
            var question = await _questionRepo.GetByIdAsync(questionId);
            if (question == null) return NotFound("Question not found");

            var all = await _repo.GetAllAsync();
            var options = all.Where(o => o.QuestionId == questionId)
                .Select(o => new AnswerOptionReadDto
                {
                    Id = o.Id,
                    QuestionId = o.QuestionId,
                    Text = o.OptionText,
                    IsCorrect = o.IsCorrect
                });

            return Ok(options);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AnswerOptionCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var question = await _questionRepo.GetByIdAsync(dto.QuestionId);
            if (question == null) return BadRequest("Question does not exist");

            var opt = new AnswerOption
            {
                QuestionId = dto.QuestionId,
                OptionText = dto.OptionText,
                IsCorrect = dto.IsCorrect
            };

            var created = await _repo.AddAsync(opt);
            return CreatedAtAction(nameof(GetByQuestion), new { questionId = dto.QuestionId }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AnswerOptionCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.OptionText = dto.OptionText;
            existing.IsCorrect = dto.IsCorrect;

            if (existing.QuestionId != dto.QuestionId)
            {
                var q = await _questionRepo.GetByIdAsync(dto.QuestionId);
                if (q == null) return BadRequest("Question not found");
                existing.QuestionId = dto.QuestionId;
            }

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
