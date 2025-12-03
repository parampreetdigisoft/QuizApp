using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.API.Models
{

        public class Question
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public string QuestionText { get; set; } = null!;

            [ForeignKey("Quiz")]
            public int QuizId { get; set; }
            public Quiz Quiz { get; set; } = null!;

            public int Points { get; set; }
            public ICollection<AnswerOption> AnswerOptions { get; set; } = null!;
        }
    }

