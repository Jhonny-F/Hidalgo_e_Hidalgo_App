namespace Presentation.ModelResponse
{
    public class ApiResult
    {
        public int? StatusCode { get; }

        public string? Message { get; }

        public virtual object? Data { get; } = null;

        public ApiResult(int status, string message)
        {
            StatusCode = status;
            Message = message;
        }
    }

    public class ApiResult<T> : ApiResult
    {
        public new T? Data { get; }

        public ApiResult(int status, T data, string message) : base(status, message)
        {
            Data = data;
        }

        public ApiResult(int status, string message) : base(status, message)
        {
            Data = default;
        }
    }
}
