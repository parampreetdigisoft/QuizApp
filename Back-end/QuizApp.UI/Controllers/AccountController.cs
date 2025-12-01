using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using QuizApp.UI.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using QuizApp.UI.Services;
using NuGet.Protocol.Plugins;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace QuizApp.UI.Controllers
{

   public class AccountController : Controller
    {
        private readonly ApiService _apiService;

        public AccountController(ApiService apiService)
        {
            _apiService = apiService;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid) return View(model);

            var payload = new { Username = model.Username, Password = model.Password };
            var response = await _apiService.PostAsync("user/login", payload);
            string role = "";
            string userid = "";
            var user = new User();
            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();

                var result = JsonConvert.DeserializeObject<LoginResponse>(jsonString);

                // Access properties
                 user = result.User;
                 role = user.Role.ToLower() == "admin" ? "Admin" : "User";
                userid = user.UserId.ToString();

                HttpContext.Session.SetInt32("UserId", user.UserId); // Simulated user ID
                HttpContext.Session.SetString("UserName", user.UserName); // Simulated user ID

            }

            //var res = response.Content.ToString();
            // var response = await _httpClient.PostAsync("user/login", content);
            if (!response.IsSuccessStatusCode)
            {
                model.ErrorMessage = "Invalid username or password";
                return View(model);
            }

            // Simulate getting role (in future you can return JWT or Role in API response)
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.Username),
                 new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim(ClaimTypes.NameIdentifier, userid),
                 new Claim(ClaimTypes.Email, user.Email),

            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            
            if (role == "Admin")
                return RedirectToAction("Index", "AdminDashboard");
            else
                return RedirectToAction("Index", "UserDashboard");
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                model.Message = "Passwords do not match!";
                return View(model);
            }

            var payload = new
            {
                Username = model.Username,
                Email = model.Email,
                Role = model.Role,
                Password = model.Password
            };

            //var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _apiService.PostAsync("user/register", payload);

            if (response.IsSuccessStatusCode)
            {
                model.Message = "User registered successfully!";
                return RedirectToAction("Login");
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                model.Message = $"Error: {error}";
                return View(model);
            }
        }
        public class LoginResponse
        {
            public User User { get; set; }
        }

        public class User
        {
            public int UserId { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string PasswordHash { get; set; }
            public string Role { get; set; }
            public DateTime CreatedAt { get; set; }
            public object Quizzes { get; set; }
            public object UserAnswers { get; set; }
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }
    }
}
