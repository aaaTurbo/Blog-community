package ru.bolvanchiki.exception

open class AppException(message: String) : RuntimeException(message)

class NotFoundException(message: String) : AppException(message)
class BadRequestException(message: String) : AppException(message)
class UnauthorizedException(message: String) : AppException(message)