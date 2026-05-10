using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomMenuToBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomMenu",
                table: "Bookings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomMenu",
                table: "Bookings");
        }
    }
}
