using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class DeveloperDeleteDto()
{
    public string UserId { get; set; } = "";
    public string Password { get; set; } = "";
}

public class DeveloperController(AppDbContext context, IConfiguration configuration) : ApiBaseController
{
    [HttpDelete("delete-user")]
    async public Task<IActionResult> DeleteAppUser(DeveloperDeleteDto deleteDto)
    {
        var devPass = configuration["DeveloperPassword"];
        if(devPass == null) return BadRequest("Could not get developer password");

        if(deleteDto.Password != devPass) return Unauthorized("Wrong password");

        var user = await context.Users.SingleOrDefaultAsync(user => user.Id == deleteDto.UserId);

        if(user == null) return BadRequest("Cannot get user");

        context.Users.Remove(user);

        if(await context.SaveChangesAsync() > 0) return Ok();

        return BadRequest("Problem deleting user from database");
    }
}
