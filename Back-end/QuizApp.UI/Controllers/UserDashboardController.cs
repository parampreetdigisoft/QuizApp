using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.UI.Models;
using QuizApp.UI.Services;
using System.Security.Claims;

namespace QuizApp.UI.Controllers
{
    [Authorize]
    public class UserDashboardController : Controller
    {
        private readonly ApiService _apiService;

        public UserDashboardController(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // ✅ Get all quizzes
            var quizzes = await _apiService.GetAsync<List<QuizDto>>("quiz/all");

            // ✅ Get user’s attempts
            var attempts = await _apiService.GetAsync<List<QuizAttemptDto>>($"QuizAttempt/byuser/{userId}");

            var model = new List<QuizDashboardViewModel>();

            foreach (var q in quizzes)
            {
                var attempt = attempts.LastOrDefault(a => a.QuizId == q.QuizId);
                int obtainedScore = attempt?.Score ?? 0;

                // ✅ Get all questions for this quiz
                var questions = await _apiService.GetAsync<List<QuestionDto>>($"question/byquiz/{q.QuizId}");

                // ✅ Calculate total score from question points
                int totalScore = questions.Sum(a => a.Points);

                model.Add(new QuizDashboardViewModel
                {
                    QuizId = q.QuizId,
                    Title = q.Title,
                    Description = q.Description,
                    TimeAllowed = q.TimeAllowed,
                    Points = q.Points,
                    ObtainedScore = obtainedScore,
                    TotalScore = totalScore,
                    UserAttempt = attempt
                });
            }

            return View(model);
        }
   
    }

}
