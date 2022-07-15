import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';

export interface EnvConfig {
  [key: string]: string;
}

export interface AppConfig {
  port: number;
  feUrl: string;
}

export interface DBConfig {
  url: string;
}

export interface StripeConfig {
  pubKey: string;
  secretKey: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  url: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly validationScheme = {
    PORT: Joi.number().default(3000),

    REDIS_HOST: Joi.string(),
    REDIS_PORT: Joi.string(),

    DB_URL: Joi.string().required(),
    FE_URL: Joi.string().required(),
    STRIPE_SECRET: Joi.string(),
    STRIPE_PUBLIC: Joi.string(),
  };

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  get app(): AppConfig {
    return {
      port: Number(this.envConfig.PORT),
      feUrl: String(this.envConfig.FE_URL),
    };
  }

  get db(): DBConfig {
    return {
      url: String(this.envConfig.DB_URL),
    };
  }

  get stripe(): StripeConfig {
    return {
      pubKey: String(this.envConfig.STRIPE_PUBLIC),
      secretKey: String(this.envConfig.STRIPE_SECRET),
    };
  }

  get redis(): RedisConfig {
    const url =
      'redis://' + this.envConfig.REDIS_HOST + ':' + this.envConfig.REDIS_PORT;
    return {
      host: String(this.envConfig.REDIS_HOST),
      port: Number(this.envConfig.REDIS_PORT),
      url,
    };
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(this.validationScheme);

    const validation = envVarsSchema.validate(envConfig);
    return validation.value;
  }
}
