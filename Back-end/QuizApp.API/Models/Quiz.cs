namespace QuizApp.API.Models
{
    public class Quiz
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public int? TimeAllowed { get; set; } // in minutes


        // Navigation
        public User? Creator { get; set; }
        public ICollection<Question>? Questions { get; set; }
        //public ICollection<Result>? Results { get; set; }
    }
}
