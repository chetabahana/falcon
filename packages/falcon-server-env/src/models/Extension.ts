import { ConfigurableConstructorParams, FetchUrlResult } from '../types';
import ApiDataSource from './ApiDataSource';
import { GraphQLResolveInfo } from 'graphql';

export default abstract class Extension<TApiConfig = object> {
  public config: object;
  public name: string;
  public api?: ApiDataSource;
  public apiConfig: TApiConfig | null = null;
  /**
   * @param {object} config Extension config object
   * @param {string} name Extension short-name
   */
  constructor({ config = {}, name }: ConfigurableConstructorParams = {}) {
    this.name = name || this.constructor.name;
    this.config = config;
  }

  /**
   * Initializes extension in this method
   * Must return a result from "api.preInitialize()"
   * @return {Promise<TApiConfig|null>} API DataSource preInitialize result
   */
  async initialize(): Promise<TApiConfig|null> {
    if (!this.api) {
      throw new Error(`"${this.name}" extension: API DataSource was not defined`);
    }
    this.apiConfig = await this.api.preInitialize<TApiConfig>();

    return this.apiConfig;
  }

  /**
   * GraphQL configuration getter
   * @return {object} GraphQL configuration object
   */
  async getGraphQLConfig(): Promise<object> {
    return {};
  }

  abstract async fetchUrl(
    obj: object,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ): Promise<FetchUrlResult>;

  get fetchUrlPriority(): number {
    return (this.api as ApiDataSource).fetchUrlPriority;
  }
}
