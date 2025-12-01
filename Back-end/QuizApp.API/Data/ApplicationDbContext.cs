using Microsoft.EntityFrameworkCore;
using QuizApp.API.Models;

namespace QuizApp.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

        public DbSet<QuizAttempt> QuizAttempts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Prevent multiple cascade delete paths
            //modelBuilder.Entity<UserAnswer>()
            //    .HasOne(ua => ua.)
            //    .WithMany()
            //    .HasForeignKey(ua => ua.UserId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<UserAnswer>()
            //    .HasOne(ua => ua.Quiz)
            //    .WithMany()
            //    .HasForeignKey(ua => ua.QuizId)
            //    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.Question)
                .WithMany()
                .HasForeignKey(ua => ua.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.SelectedOption)
                .WithMany()
                .HasForeignKey(ua => ua.SelectedOptionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
