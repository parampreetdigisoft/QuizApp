namespace QuizApp.API.Models
{
    public class QuizAttempt
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }

        // Navigation
        public Quiz Quiz { get; set; } = null!;
        public User User { get; set; } = null!;
        public ICollection<UserAnswer>? Answers { get; set; } 
    }
}
