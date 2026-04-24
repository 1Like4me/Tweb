using MyApp.BusinessLayer.Core;
using MyApp.BusinessLayer.Interfaces;
using MyApp.DataAccess;
using MyApp.Domain.Entities;
using MyApp.Domain.Models.Project;

namespace MyApp.BusinessLayer.Structure;

public class ProjectActionExecution : ProjectActions, IProjectAction
{
    public ProjectActionExecution(AppDbContext db) : base(db) { }

    public Task<IEnumerable<ProjectDetailDto>> GetAllProjectsActionAsync(CancellationToken cancellationToken = default)
    {
        return GetAllProjectsActionExecution(cancellationToken);
    }

    public Task<ProjectDetailDto?> GetProjectByIdActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return GetProjectByIdActionExecution(id, cancellationToken);
    }

    public Task<ProjectDetailDto> CreateProjectActionAsync(Project project, CancellationToken cancellationToken = default)
    {
        return CreateProjectActionExecution(project, cancellationToken);
    }

    public Task<ProjectDetailDto?> UpdateProjectActionAsync(Project project, CancellationToken cancellationToken = default)
    {
        return UpdateProjectActionExecution(project, cancellationToken);
    }

    public Task<bool> DeleteProjectActionAsync(int id, CancellationToken cancellationToken = default)
    {
        return DeleteProjectActionExecution(id, cancellationToken);
    }
}
