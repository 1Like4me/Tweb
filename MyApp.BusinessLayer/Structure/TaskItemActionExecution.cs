using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.TaskItem;

namespace MyApp.BusinessLayer.Structure;

public class TaskItemActionExecution : TaskItemActions, ITaskItemAction
{
    public TaskItemActionExecution(AppDbContext db) : base(db) { }

    public Task<IEnumerable<TaskItemDetailDto>> GetAllTaskItemsActionAsync(CancellationToken cancellationToken = default)
    {
        return GetAllTaskItemsActionExecution(cancellationToken);
    }

    public Task<TaskItemDetailDto?> GetTaskItemByIdActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return GetTaskItemByIdActionExecution(id, cancellationToken);
    }

    public Task<TaskItemDetailDto> CreateTaskItemActionAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        return CreateTaskItemActionExecution(task, cancellationToken);
    }

    public Task<TaskItemDetailDto?> UpdateTaskItemActionAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        return UpdateTaskItemActionExecution(task, cancellationToken);
    }

    public Task<bool> DeleteTaskItemActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return DeleteTaskItemActionExecution(id, cancellationToken);
    }
}
