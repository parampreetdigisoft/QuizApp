using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.UI.Models;
using QuizApp.UI.Services;
using System.Security.Claims;

namespace QuizApp.UI.Controllers
{
    [Authorize]
    public class TakeQuizController : Controller
    {
        private readonly ApiService _apiService;

        public TakeQuizController(ApiService apiService)
        {
            _apiService = apiService;
        }

        // ✅ Display quiz questions (randomized)
        public async Task<IActionResult> Start(int quizId)
        {
            //quizId = 6;
            var questions = await _apiService.GetAsync<List<QuestionDto>>($"question/byquiz/{quizId}");
            var quiz = await _apiService.GetAsync<QuizDto>($"quiz/{quizId}");
            ViewBag.QuizId = quizId.ToString();
            // Randomize order
            var random = new Random();
            var randomizedQuestions = questions.OrderBy(q => random.Next()).ToList();
            ViewBag.Time = quiz.TimeAllowed;
            ViewBag.Quiz = quiz;
            return View(randomizedQuestions);
        }

        // ✅ Submit answers via AJAX
        //[HttpPost]
        public async Task<IActionResult> SubmitAnswers([FromBody] List<UserAnswerRequest> answers)
        {
            var response = await _apiService.PostAsync("useranswers/submit", answers);
            return Json(await response.Content.ReadAsStringAsync());
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuiz(IFormCollection form,string quizid)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            int quizId = int.Parse(quizid);

            int score = 0;
            int totalQuestions = 0;

            var questions = await _apiService.GetAsync<List<QuestionDto>>($"question/byquiz/{quizId}");
            var answersToSave = new List<UserAnswerDto>();

            foreach (var question in questions)
            {
                totalQuestions++;
                string answerKey = $"q_{question.Id}";
                if (form.ContainsKey(answerKey))
                {
                    var selectedOptionId = int.Parse(form[answerKey]!);
                    var correctOption = question.AnswerOptions.FirstOrDefault(o => o.IsCorrect);
                    bool isCorrect = correctOption != null && selectedOptionId == correctOption.Id;
                    if (isCorrect) score += question.Points > 0 ? question.Points : 1; 

                    answersToSave.Add(new UserAnswerDto
                    {
                        QuestionId = question.Id,
                        SelectedOptionId = selectedOptionId,
                        IsCorrect = isCorrect
                    });
                }
            }

            var attempt = new QuizAttemptDto
            {
                QuizId = quizId,
                UserId = userId,
                Score = score,
                TotalQuestions = totalQuestions,
                Answers = answersToSave
            };

            await _apiService.PostAsync("QuizAttempt", attempt);
            var sum = questions.Sum(q => q.Points);


               ViewBag.Score = score;
               ViewBag.Total = sum;

                return View("Result");
            //return RedirectToAction("Result", new { score, total = totalQuestions });
        }


    }
}
