using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Presentation.Hubs;

internal sealed class ChessHubContextBridge : IHubContext<ChessHubBase>
{
    private readonly IHubContext<ChessHub> _inner;

    public ChessHubContextBridge(IHubContext<ChessHub> inner)
    {
        _inner = inner;
    }

    public IHubClients Clients => _inner.Clients;
    public IGroupManager Groups => _inner.Groups;
}
