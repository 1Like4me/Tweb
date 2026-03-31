using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain;

namespace MyApp.BusinessLayer.Crud;

public class TaskItemService : ITaskItemService
{
    private readonly AppDbContext _db;

    public TaskItemService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Tasks.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<TaskItem> CreateAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        task.CreatedAt = DateTime.UtcNow;
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync(cancellationToken);
        return task;
    }

    public async Task<TaskItem?> UpdateAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == task.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Name = task.Name;
        existing.ProjectId = task.ProjectId;

        await _db.SaveChangesAsync(cancellationToken);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        _db.Tasks.Remove(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}

