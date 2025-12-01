using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace QuizApp.UI.Controllers
{
    //[Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult ManageUsers() => View();
        public IActionResult ManageQuizzes() => View();
        public IActionResult ManageQuestions() => View();
        public IActionResult ManageAnswers() => View();
    }
}
