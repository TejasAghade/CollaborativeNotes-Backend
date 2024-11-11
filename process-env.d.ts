declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      POSTGRES_USER: string;
      POSTGRES_PASS: string;
      POSTGRES_PORT: string;
      POSTGRES_DB: string;
      POSTGRES_HOST: string;
      SECRET_KEY: string;
      SALT: number;
      IV: string;
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY: string;
      // add more environment variables and their types here
    }
  }
}