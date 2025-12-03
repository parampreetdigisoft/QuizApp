namespace QuizApp.API.Models
{
    //public class UserAnswer
    //{
    //    public int UserAnswerId { get; set; }
    //    public int UserId { get; set; }
    //    public int QuizId { get; set; }
    //    public int QuestionId { get; set; }
    //    public int SelectedOptionId { get; set; }
    //    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    //    // Navigation
    //    public User? User { get; set; }
    //    public Quiz? Quiz { get; set; }
    //    public Question? Question { get; set; }
    //    public AnswerOption? SelectedOption { get; set; }
    //}
    public class QuizAttemptDto
    {
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }

        // Navigation
        public ICollection<UserAnswerDto>? Answers { get; set; }
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
        public bool IsCorrect { get; set; }
        public int UserId { get; set; }
    }

    public class UserAnswer
    {
        public int Id { get; set; }
        public int? QuizAttemptId { get; set; }
        public int? QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool? IsCorrect { get; set; }
        public int? UserId { get; set; }

        // Navigation
        public QuizAttempt QuizAttempt { get; set; } = null!;

        public Question Question { get; set; } = null!;
        public AnswerOption SelectedOption { get; set; } = null!;
    }
}