using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace QuizApp.API.DTOs
{
    public class Dto
    {
    }

    public class QuizCreateDto
    {
        [Required, StringLength(200)]
        public string Title { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }

        public int? TimeAllowed { get; set; } // in minutes

        public bool IsActive { get; set; } = true;
    }

    public class QuizReadDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int? TimeAllowed { get; set; } // in minutes
        public DateTime? CreatedAt { get; set; }
    }

    public class QuestionCreateDto
    {
        [Required]
        public int QuizId { get; set; }

        [Required, StringLength(1000)]
        public string QuestionText { get; set; } = null!;

        [Range(1, 100)]
        public int Points { get; set; } = 1;
    }

    public class QuestionReadDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int Points { get; set; }

        // ✅ Add this property
        public List<AnswerOptionReadDto> AnswerOptions { get; set; } = new();
    }

    public class AnswerOptionReadDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
    }

    public class AnswerOptionCreateDto
    {
        [Required]
        public int QuestionId { get; set; }

        [Required, StringLength(1000)]
        public string OptionText { get; set; } = null!;

        public bool IsCorrect { get; set; } = false;
    }

    //public class AnswerOptionReadDto
    //{
    //    public int Id { get; set; }
    //    public int QuestionId { get; set; }
    //    public string OptionText { get; set; }
    //    public bool IsCorrect { get; set; }
    //}
}