import { UnauthorizedException } from '@nestjs/common'
import { RequireUserGuard } from './user.guard'

describe('UserGuard', () => {
  it('should be defined', () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(reflactor as any, {} as any)
    expect(guard).toBeDefined()
  })

  it('should allow active', async () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(
      reflactor as any,
      {
        getOne: () =>
          ({
            active: true,
            otpVerified: true,
          }) as any,
      } as any,
    )
    expect(guard).toBeDefined()
    await guard.canActivate({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getHandler: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: '1234' },
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getClass: () => ({}),
    } as any)
    expect(reflactor.getAllAndOverride).toBeCalledTimes(1)
  })

  it('should allow on user active and email active', async () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(
      reflactor as any,
      {
        getOne: () =>
          ({
            active: true,
            emailVerified: true,
          }) as any,
      } as any,
    )
    expect(guard).toBeDefined()
    try {
      await guard.canActivate({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getHandler: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { sub: '1234' },
          }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getClass: () => ({}),
      } as any)
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
      expect(reflactor.getAllAndOverride).toBeCalledTimes(1)
    }
  })

  it('should not allow none verified', async () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(
      reflactor as any,
      {
        getOne: () =>
          ({
            active: true,
            otpVerified: false,
            emailVerified: false,
          }) as any,
      } as any,
    )
    expect(guard).toBeDefined()
    try {
      await guard.canActivate({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getHandler: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { sub: '1234' },
          }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getClass: () => ({}),
      } as any)
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
      expect(reflactor.getAllAndOverride).toBeCalledTimes(1)
    }
  })

  it('should not allow inactive', async () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(
      reflactor as any,
      {
        getOne: () =>
          ({
            active: false,
            otpVerified: true,
          }) as any,
      } as any,
    )
    expect(guard).toBeDefined()
    try {
      await guard.canActivate({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getHandler: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { sub: '1234' },
          }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getClass: () => ({}),
      } as any)
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
      expect(reflactor.getAllAndOverride).toBeCalledTimes(1)
    }
  })

  it('should not allow on user doesnt exist', async () => {
    const reflactor = {
      get: jest.fn(),
      getAllAndOverride: jest.fn().mockReturnValue(false),
    }
    const guard = new RequireUserGuard(
      reflactor as any,
      {
        getOne: () => null as any,
      } as any,
    )
    expect(guard).toBeDefined()
    try {
      await guard.canActivate({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getHandler: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { sub: '1234' },
          }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        getClass: () => ({}),
      } as any)
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
      expect(reflactor.getAllAndOverride).toBeCalledTimes(1)
    }
  })
})
