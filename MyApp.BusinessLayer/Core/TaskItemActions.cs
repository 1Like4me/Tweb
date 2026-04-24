using Microsoft.EntityFrameworkCore;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.TaskItem;

namespace MyApp.BusinessLayer.Core;

public class TaskItemActions
{
    private readonly AppDbContext _db;

    public TaskItemActions(AppDbContext db)
    {
        _db = db;
    }

    internal async Task<IEnumerable<TaskItemDetailDto>> GetAllTaskItemsActionExecution(CancellationToken cancellationToken = default)
    {
        var tasks = await _db.Tasks.AsNoTracking().ToListAsync(cancellationToken);
        return tasks.Select(MapTaskItemToDetailDto);
    }

    internal async Task<TaskItemDetailDto?> GetTaskItemByIdActionExecution(int id, CancellationToken cancellationToken = default)
    {
        var task = await _db.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        return task is null ? null : MapTaskItemToDetailDto(task);
    }

    internal async Task<TaskItemDetailDto> CreateTaskItemActionExecution(TaskItem task, CancellationToken cancellationToken = default)
    {
        task.CreatedAt = DateTime.UtcNow;
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync(cancellationToken);
        return MapTaskItemToDetailDto(task);
    }

    internal async Task<TaskItemDetailDto?> UpdateTaskItemActionExecution(TaskItem task, CancellationToken cancellationToken = default)
    {
        var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == task.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        existing.Title = task.Title;
        existing.Description = task.Description;
        existing.Priority = task.Priority;
        existing.Status = task.Status;
        existing.DueDate = task.DueDate;
        existing.AssignedUserId = task.AssignedUserId;
        existing.ProjectId = task.ProjectId;

        await _db.SaveChangesAsync(cancellationToken);
        return MapTaskItemToDetailDto(existing);
    }

    internal async Task<bool> DeleteTaskItemActionExecution(int id, CancellationToken cancellationToken = default)
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

    private static TaskItemDetailDto MapTaskItemToDetailDto(TaskItem task)
    {
        return new TaskItemDetailDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Status = task.Status,
            DueDate = task.DueDate.HasValue ? task.DueDate.Value.ToDateTime(TimeOnly.MinValue) : null,
            AssignedUserId = task.AssignedUserId,
            ProjectId = task.ProjectId
        };
    }
}
