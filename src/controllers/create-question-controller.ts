import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/corrent-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

@Controller("/question")
@UseGuards(AuthGuard("jwt"))
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);

    return "ok";
  }
}
