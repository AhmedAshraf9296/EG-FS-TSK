import type { JwtService } from '@lib/common'
import { Reflector } from '@nestjs/core'
import { CookieGuard } from './cookie.guard'

describe('Cookie Guard', () => {
  it('Test setup correctly', () => {
    const verifyToken = jest.fn()
    const cookieGuard = new CookieGuard(
      {
        verifyToken,
      } as unknown as JwtService,
      new Reflector(),
    )
    expect(cookieGuard).toBeDefined()
  })

  it('Test canActivate', async () => {
    const verifyToken = jest.fn()
    const cookieGuard = new CookieGuard(
      {
        verifyToken,
      } as unknown as JwtService,
      {
        getAllAndOverride: () => false,
      } as any,
    )

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            authentication: 'test',
          },
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getHandler: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getClass: () => {},
    }
    verifyToken.mockReturnValue(true)

    const result = await cookieGuard.canActivate(mockContext as any)
    expect(result).toBe(true)
  })

  it('Should allow public routes', async () => {
    const verifyToken = jest.fn()
    const cookieGuard = new CookieGuard(
      {
        verifyToken,
      } as unknown as JwtService,
      {
        getAllAndOverride: () => true,
      } as any,
    )

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            authentication: 'test',
          },
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getHandler: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      getClass: () => {},
    }
    verifyToken.mockReturnValue(true)

    const result = await cookieGuard.canActivate(mockContext as any)
    expect(result).toBe(true)
  })
})
