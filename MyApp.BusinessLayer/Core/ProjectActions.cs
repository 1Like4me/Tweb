using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Project;

namespace MyApp.BusinessLayer.Core;

public class ProjectActions
{
    private readonly AppDbContext _db;

    public ProjectActions(AppDbContext db)
    {
        _db = db;
    }

    internal async Task<IEnumerable<ProjectDetailDto>> GetAllProjectsActionExecution(CancellationToken cancellationToken = default)
    {
        var projects = await _db.Projects.AsNoTracking().ToListAsync(cancellationToken);
        return projects.Select(MapProjectToDetailDto);
    }

    internal async Task<ProjectDetailDto?> GetProjectByIdActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var project = await _db.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        return project is null ? null : MapProjectToDetailDto(project);
    }

    internal async Task<ProjectDetailDto> CreateProjectActionExecution(Project project, CancellationToken cancellationToken = default)
    {
        project.CreatedAt = DateTime.UtcNow;
        _db.Projects.Add(project);
        await _db.SaveChangesAsync(cancellationToken);
        return MapProjectToDetailDto(project);
    }

    internal async Task<ProjectDetailDto?> UpdateProjectActionExecution(Project project, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Projects.FirstOrDefaultAsync(p => p.Id == project.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Name = project.Name;
        existing.UserId = project.UserId;

        await _db.SaveChangesAsync(cancellationToken);
        return MapProjectToDetailDto(existing);
    }

    internal async Task<bool> DeleteProjectActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        _db.Projects.Remove(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProjectDetailDto MapProjectToDetailDto(Project project)
    {
        return new ProjectDetailDto
        {
            Id = project.Id,
            Name = project.Name,
            CreatedAt = project.CreatedAt,
            UserId = project.UserId
        };
    }
}
