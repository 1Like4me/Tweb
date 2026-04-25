using MyApp.Domain.Entities;
using MyApp.Domain.Models.Project;

namespace MyApp.BusinessLayer.Interfaces;

public interface IProjectAction
{
    Task<IEnumerable<ProjectDetailDto>> GetAllProjectsActionAsync(CancellationToken cancellationToken = default);
    Task<ProjectDetailDto?> GetProjectByIdActionAsync(int id, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto> CreateProjectActionAsync(Project project, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto?> UpdateProjectActionAsync(Project project, CancellationToken cancellationToken = default);
    Task<bool> DeleteProjectActionAsync(int id, CancellationToken cancellationToken = default);
}
