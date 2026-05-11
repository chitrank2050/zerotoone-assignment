import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser - Custom parameter decorator to extract the user object from
 * the execution context.
 *
 * Pattern: This is the standard NestJS way to retrieve the authenticated user
 * in a controller without manually parsing the request object or repeating
 * hardcoded placeholders.
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
