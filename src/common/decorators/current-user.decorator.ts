import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    if (user && user.sub) {
      // Mapeia sub para id para manter compatibilidade
      user.id = Number(user.sub);
    }
    
    return user;
  },
); 