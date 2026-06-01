namespace Domain.Entities;

public class PlayerTimer
{
    private readonly TimeSpan _tickInterval = TimeSpan.FromSeconds(1);

    private TimeSpan _remainingTime;
    private CancellationTokenSource _cts;
    private DateTime _turnStartTime;

    public Func<TimeSpan, Task>? OnTick { get; set; }

    public PlayerTimer(TimeSpan gameTime)
    {
        _remainingTime = gameTime;
    }

    public void StartTurn()
    {
        _turnStartTime = DateTime.UtcNow; // ✅ FIX: ustawienie startu tury
        _cts = new CancellationTokenSource();
        _ = RunTimerAsync(_cts.Token);
    }

    public void EndTurn()
    {
        if (_cts != null && !_cts.IsCancellationRequested)
        {
            _cts.Cancel();
            var elapsed = DateTime.UtcNow - _turnStartTime;
            _remainingTime -= elapsed;

            if (_remainingTime < TimeSpan.Zero)
                _remainingTime = TimeSpan.Zero;
        }
    }

    private async Task RunTimerAsync(CancellationToken token)
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
                break;

            await Task.Delay(_tickInterval, token);
        }

        if (!token.IsCancellationRequested)
            EndTurn();
    }

    public TimeSpan GetRemainingTime() => _remainingTime;
}
