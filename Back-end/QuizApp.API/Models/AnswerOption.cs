using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.API.Models
{
    public class AnswerOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string OptionText { get; set; } = null!;

        public bool IsCorrect { get; set; }

        // Foreign key
        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!; 
    }
}
