namespace QuizApp.UI.Models
{
    public class RegisterViewModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } // "Admin" or "User"
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        public string Message { get; set; }
    }
}
