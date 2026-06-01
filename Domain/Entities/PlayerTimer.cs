namespace Domain.Entities;

public class PlayerTimer
{
    private readonly TimeSpan _tickInterval = TimeSpan.FromSeconds(1);
    private readonly object _gate = new();

    private TimeSpan _remainingTime;
    private CancellationTokenSource? _cts;
    private DateTime _turnStartTime;

    public Func<TimeSpan, Task>? OnTick { get; set; }

    public PlayerTimer(TimeSpan gameTime)
    {
        _remainingTime = gameTime;
    }

    public void StartTurn()
    {
        lock (_gate)
        {
            _cts?.Dispose();
            _turnStartTime = DateTime.UtcNow;
            _cts = new CancellationTokenSource();
        }

        _ = RunTimerAsync(_cts.Token);
    }

    public void EndTurn()
    {
        CancellationTokenSource? toDispose = null;
        lock (_gate)
        {
            if (_cts == null || _cts.IsCancellationRequested)
                return;

            _cts.Cancel();
            var elapsed = DateTime.UtcNow - _turnStartTime;
            _remainingTime -= elapsed;

            if (_remainingTime < TimeSpan.Zero)
                _remainingTime = TimeSpan.Zero;

            toDispose = _cts;
            _cts = null;
        }

        toDispose?.Dispose();
    }

    private async Task RunTimerAsync(CancellationToken token)
    {
        try
        {
            while (!token.IsCancellationRequested)
            {
                var elapsed = DateTime.UtcNow - _turnStartTime;
                var timeLeft = _remainingTime - elapsed;

                if (timeLeft < TimeSpan.Zero)
                    timeLeft = TimeSpan.Zero;

                if (OnTick != null)
                    await OnTick.Invoke(timeLeft);

                if (timeLeft <= TimeSpan.Zero)
                {
                    EndTurn();
                    return;
                }

                await Task.Delay(_tickInterval, token);
            }
        }
        catch (TaskCanceledException) { }
        catch (OperationCanceledException) { }
    }

    public TimeSpan GetRemainingTime() => _remainingTime;
}
