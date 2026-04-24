using MyApp.Domain.Entities;
using MyApp.Domain.Models.TaskItem;

namespace MyApp.BusinessLayer.Interfaces;

public interface ITaskItemAction
{
    Task<IEnumerable<TaskItemDetailDto>> GetAllTaskItemsActionAsync(CancellationToken cancellationToken = default);
    Task<TaskItemDetailDto?> GetTaskItemByIdActionAsync(int id, CancellationToken cancellationToken = default);
    Task<TaskItemDetailDto> CreateTaskItemActionAsync(TaskItem task, CancellationToken cancellationToken = default);
    Task<TaskItemDetailDto?> UpdateTaskItemActionAsync(TaskItem task, CancellationToken cancellationToken = default);
    Task<bool> DeleteTaskItemActionAsync(int id, CancellationToken cancellationToken = default);
}
