import {GameGateway} from './game/game.gateway'
import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [GameGateway, AppService]
})
export class AppModule {}
