import { Controller, Get, Module, VERSION_NEUTRAL } from "@nestjs/common";
import { HealthCheck, HealthCheckService, TerminusModule } from '@nestjs/terminus';

@Controller({ path: 'health', version: VERSION_NEUTRAL})
export class HealthController {
    constructor(private readonly health: HealthCheckService) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([])
    }
}

@Module({ imports: [TerminusModule], controllers: [HealthController]})
export class HealthModule {}