export const ErrorsMessagesAndCode = {
  InternalServerError: {
    message: 'Internal server error',
    description: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  },
  InvalidCredentials: {
    message: 'Invalid credentials',
    description: 'Invalid credentials',
    code: 'INVALID_CREDENTIALS',
  },
  EmailExists: {
    message: 'Email already exists',
    description: 'Email already exists',
    code: 'EMAIL_EXISTS',
  },
  PhoneExists: {
    message: 'Phone already exists',
    description: 'Phone already exists',
    code: 'PHONE_EXISTS',
  },
  UserNotFound: {
    message: 'User not found',
    description: 'User not found',
    code: 'USER_NOT_FOUND',
  },
  NotAllowedRole: {
    message: 'Roles Lacks permission',
    description: 'Not allowed role',
    code: 'INSUFFICIENT_ROLE_PERMISSION',
  },
  CannotDeleteSelf: {
    message: 'Cannot delete self',
    description: 'You cannot delete yourself',
    code: 'CANNOT_DELETE_SELF',
  },
  SnapNotFound: {
    message: 'Snap not found',
    description: 'Snap not found for this user! check the snap id and token',
    code: 'SNAP_NOT_FOUND',
  },
  UserSessionNotFound: {
    message: 'Session with this user not found',
    description: 'User with this Session not found',
    code: 'SESSION_NOT_FOUND',
  },
  BadImageFormat: {
    message: 'Bad image format',
    description: 'Bad image format',
    code: 'BAD_IMAGE_FORMAT',
  },
  FailedToUploadImage: {
    message: 'Failed to upload images',
    description: 'Failed to upload images',
    code: 'FAILED_TO_UPLOAD_IMAGE',
  },
  InvalidImageType: {
    message: 'Invalid image type',
    description: 'Invalid image type',
    code: 'INVALID_IMAGE_TYPE',
  },
} as const
