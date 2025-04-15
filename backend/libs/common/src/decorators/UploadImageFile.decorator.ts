import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common'

export function UploadedImage({
  required = true,
  maxSize = 1024 * 1024 * 5,
}: { required?: boolean; maxSize?: number } = {}) {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: required,
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({
          fileType: /image\/(png|jpg|jpeg)/,
        }),
      ],
    }),
  )
}

export function UploadedImages({
  required = true,
  maxSize = 1024 * 1024 * 5,
}: { maxSize?: number; required?: boolean } = {}) {
  return UploadedFiles(
    new ParseFilePipe({
      fileIsRequired: required,
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({
          fileType: /image\/(png|jpg|jpeg|webp)/,
        }),
      ],
    }),
  )
}

export function UploadedExcel({
  required = true,
  maxSize = 1024 * 1024 * 5,
}: { required?: boolean; maxSize?: number } = {}) {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: required,
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({
          fileType:
            /application\/vnd.oasis.opendocument.spreadsheet|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/,
        }),
      ],
    }),
  )
}
