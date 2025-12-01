using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.UI.Models;
using QuizApp.UI.Services;

namespace QuizApp.UI.Controllers
{
    [Authorize]
    public class AdminDashboardController : Controller
    {
        private readonly ApiService _apiService;

        public AdminDashboardController(ApiService apiService)
        {
            _apiService = apiService;
        }
        public async Task<IActionResult> Index()
        {
            var quizzes = await _apiService.GetAsync<List<QuizDto>>("quiz/all");
            var allAttempts = await _apiService.GetAsync<List<QuizAttempt_Dto>>("QuizAttempt/allattempts");
            var allQuestions = await _apiService.GetAsync<List<QuestionDto>>("question/all");
            var allAnswers = await _apiService.GetAsync<List<UserAnswerDto>>("UserAnswers/all");
            var allUsers = await _apiService.GetAsync<List<UserDo>>("user/all"); // ✅ get all users once

            // Build dictionary for fast lookup
            var userLookup = allUsers.ToDictionary(u => u.UserId, u => u.UserName);

            var model = new List<AdminQuizDashboardViewModel>();

            foreach (var quiz in quizzes)
            {
                var quizAttempts = allAttempts.Where(a => a.QuizId == quiz.QuizId).ToList();
                int totalAttempts = quizAttempts.Count;
                int userCount = quizAttempts.Select(a => a.UserId).Distinct().Count();

                // ✅ Highest Scorer
                var topAttempt = quizAttempts.OrderByDescending(a => a.Score).FirstOrDefault();
                string highestScorerName = "N/A";

                if (topAttempt != null && userLookup.ContainsKey(topAttempt.UserId))
                    highestScorerName = userLookup[topAttempt.UserId];

                // ✅ Average Score
                double avgScore = quizAttempts.Any() ? quizAttempts.Average(a => a.Score) : 0;

                // ✅ Difficult question logic (same as before)
                var quizQuestions = allQuestions.Where(q => q.QuizId == quiz.QuizId).ToList();
                var questionDifficulty = new List<QuestionDifficulty>();

                foreach (var question in quizQuestions)
                {
                    var answersForQuestion = allAnswers.Where(a => a.QuestionId == question.Id).ToList();
                    if (answersForQuestion.Any())
                    {
                        double correctCount = answersForQuestion.Count(a => a.IsCorrect);
                        double totalCount = answersForQuestion.Count;
                        double difficulty = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

                        questionDifficulty.Add(new QuestionDifficulty
                        {
                            QuestionText = question.QuestionText,
                            CorrectPercentage = difficulty
                        });
                    }
                }

                var mostDifficult = questionDifficulty.OrderBy(x => x.CorrectPercentage).FirstOrDefault();

                model.Add(new AdminQuizDashboardViewModel
                {
                    QuizId = quiz.QuizId,
                    Title = quiz.Title,
                    TotalAttempts = totalAttempts,
                    UserCount = userCount,
                    HighestScorerName = highestScorerName, // ✅ username instead of ID
                    HighestScore = topAttempt?.Score ?? 0,
                    AverageScore = avgScore,
                    MostDifficultQuestion = mostDifficult?.QuestionText ?? "N/A",
                    DifficultQuestionAccuracy = mostDifficult?.CorrectPercentage ?? 0
                });
            }

            return View(model);
        }

        public class UserDo
        {
            public int UserId { get; set; }
            public string UserName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string PasswordHash { get; set; } = string.Empty;
            public string Role { get; set; } = "User";
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            // Navigation
            public ICollection<QuizDto>? Quizzes { get; set; }
            public ICollection<UserAnswer>? UserAnswers { get; set; }
            //public ICollection<Result>? Results { get; set; }
        }
        public class QuizDto
        {
            public int QuizId { get; set; }
            public string Title { get; set; } = string.Empty;
            public string? Description { get; set; }
            public int CreatedBy { get; set; }
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public bool IsActive { get; set; } = true;
            public int? TimeAllowed { get; set; } // in minutes


            // Navigation
            public UserDo? Creator { get; set; }
            public ICollection<QuestionDto>? Questions { get; set; }
            //public ICollection<Result>? Results { get; set; }
        }
        //public async Task<IActionResult> Index()
        //{
        //    // ✅ Get all quizzes
        //    var quizzes = await _apiService.GetAsync<List<QuizDto>>("quiz/all");
        //    var allAttempts = await _apiService.GetAsync<List<QuizAttemptDto>>("QuizAttempt/all");
        //    var allQuestions = await _apiService.GetAsync<List<QuestionDto>>("question/all");
        //    var allAnswers = await _apiService.GetAsync<List<UserAnswer_Dto>>("UserAnswers/all"); // optional if available

        //    var model = new List<AdminQuizDashboardViewModel>();

        //    foreach (var quiz in quizzes)
        //    {
        //        var quizAttempts = allAttempts.Where(a => a.QuizId == quiz.QuizId).ToList();
        //        int totalAttempts = quizAttempts.Count;
        //        int userCount = quizAttempts.Select(a => a.UserId).Distinct().Count();

        //        // ✅ Highest Scorer
        //        var topAttempt = quizAttempts.OrderByDescending(a => a.Score).FirstOrDefault();

        //        // ✅ Average Score
        //        double avgScore = quizAttempts.Count > 0
        //            ? quizAttempts.Average(a => a.Score)
        //            : 0;

        //        // ✅ Get quiz questions
        //        var quizQuestions = allQuestions.Where(q => q.QuizId == quiz.QuizId).ToList();

        //        // ✅ Difficult Questions (lowest % correct)
        //        var questionDifficulty = new List<QuestionDifficulty>();
        //        foreach (var question in quizQuestions)
        //        {
        //            var answersForQuestion = allAnswers.Where(a => a.QuestionId == question.Id).ToList();
        //            if (answersForQuestion.Any())
        //            {
        //                double correctCount = answersForQuestion.Count(a => a.IsCorrect.HasValue);
        //                double totalCount = answersForQuestion.Count();
        //                double difficulty = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

        //                questionDifficulty.Add(new QuestionDifficulty
        //                {
        //                    QuestionText = question.QuestionText,
        //                    CorrectPercentage = difficulty
        //                });
        //            }
        //        }

        //        var mostDifficult = questionDifficulty.OrderBy(x => x.CorrectPercentage).FirstOrDefault();

        //        model.Add(new AdminQuizDashboardViewModel
        //        {
        //            QuizId = quiz.QuizId,
        //            Title = quiz.Title,
        //            TotalAttempts = totalAttempts,
        //            UserCount = userCount,
        //            HighestScorerName = topAttempt?.UserId.ToString() ?? "N/A",
        //            HighestScore = topAttempt?.Score ?? 0,
        //            AverageScore = avgScore,
        //            MostDifficultQuestion = mostDifficult?.QuestionText ?? "N/A",
        //            DifficultQuestionAccuracy = mostDifficult?.CorrectPercentage ?? 0
        //        });
        //    }

        //    return View(model);
        //}

    }
}
