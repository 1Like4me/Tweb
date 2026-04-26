using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;

namespace MyApp.BusinessLayer.Crud;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _db;

    public ProjectService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Projects.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default)
    {
        project.CreatedAt = DateTime.UtcNow;
        _db.Projects.Add(project);
        await _db.SaveChangesAsync(cancellationToken);
        return project;
    }

    public async Task<Project?> UpdateAsync(Project project, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Projects.FirstOrDefaultAsync(p => p.Id == project.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Name = project.Name;
        existing.UserId = project.UserId;

        await _db.SaveChangesAsync(cancellationToken);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
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
}

