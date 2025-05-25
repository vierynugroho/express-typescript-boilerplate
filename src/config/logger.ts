// Fixed Morgan Logger Format
export const logger_format = {
  MORGAN_FORMAT: function (
    tokens: import('morgan').TokenIndexer<
      import('express').Request,
      import('express').Response
    >,
    req: import('express').Request,
    res: import('express').Response
  ): string {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);
    const status = tokens.status(req, res);

    // Determine emoji based on status code
    let statusEmoji = '';
    const statusCode = parseInt(status as string);

    if (statusCode >= 200 && statusCode < 300) {
      statusEmoji = '✅'; // Success
    } else if (statusCode >= 300 && statusCode < 400) {
      statusEmoji = '🔄'; // Redirect
    } else if (statusCode >= 400) {
      statusEmoji = '❌'; // Error
    } else {
      statusEmoji = '⚪'; // unknown
    }

    return `${statusEmoji} - ${method} [${status}] ${url} - ${responseTime} ms`;
  },
};
