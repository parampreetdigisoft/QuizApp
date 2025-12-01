namespace QuizApp.UI.Models
{
    public class QuizDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? TimeAllowed { get; set; }
        public int? Points { get; set; }
    }

    public class QuizAttemptDto
    {
      
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }

        // Navigation
        public ICollection<UserAnswerDto> Answers { get; set; }
    }
    public class QuizAttempt_Dto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } // ✅ added
        public int Score { get; set; }
    }

    public class UserAnswer
    {

        public int QuizAttemptId { get; set; }
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
        public bool IsCorrect { get; set; }

       
    }
    public class UserAnswerDto
    {


        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
        public bool IsCorrect { get; set; }


    }
    public class UserAnswer_Dto
    {
        public int Id { get; set; }
        public int? QuizAttemptId { get; set; }
        public int? QuestionId { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool? IsCorrect { get; set; }
        public int? UserId { get; set; }

        // Navigation
   
    }
    public class QuestionDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public int Points { get; set; }

        // ✅ Include answer options
        public List<AnswerOptionDto> AnswerOptions { get; set; } = new();
    }

    public class AnswerOptionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
    }


  

    public class UserAnswerRequest
    {
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
    }

    public class QuizDashboardViewModel
    {
        public int QuizId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? TimeAllowed { get; set; }
        public int? Points { get; set; }

        public int ObtainedScore { get; set; }
        public int TotalScore { get; set; }

        public QuizAttemptDto? UserAttempt { get; set; }
    }
    public class AdminQuizDashboardViewModel
    {
        public int QuizId { get; set; }
        public string Title { get; set; }
        public int TotalAttempts { get; set; }
        public int UserCount { get; set; }
        public string HighestScorerName { get; set; }
        public int HighestScore { get; set; }
        public double AverageScore { get; set; }
        public string MostDifficultQuestion { get; set; }
        public double DifficultQuestionAccuracy { get; set; }
    }

    public class QuestionDifficulty
    {
        public string QuestionText { get; set; }
        public double CorrectPercentage { get; set; }
    }



}
