import { Result } from 'neverthrow';
import { UseCaseError } from './useCaseError';

export type UseCaseResult<IResponse> = Result<IResponse, UseCaseError>;

export interface UseCase<IRequest, IResponse> {
  execute(
    request?: IRequest,
  ): Promise<UseCaseResult<IResponse>> | UseCaseResult<IResponse>;
}
