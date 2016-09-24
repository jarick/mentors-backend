
import Handler from './handler'

export function ErrorHandler(error, ctx) {
  Handler(error, ctx)
}

export function AccessDeniedHttpException() {
  return {
    type: 'access_denied'
  }
}

export function BadRequestHttpException(errors = []) {
  return {
    type: 'bad_request',
    errors: errors
  }
}

export function ConflictHttpException() {
  return {
    type: 'conflict'
  }
}

export function GoneHttpException() {
  return {
    type: 'gone'
  }
}

export function HttpException(reason = 'undefined') {
  return {
    type: 'internal_error',
    reason: reason
  }
}

export function LengthRequiredHttpException() {
  return {
    type: 'length_required'
  }
}

export function MethodNotAllowedHttpException(allow = []) {
  return {
    type: 'method_not_allowed',
    allow: allow
  }
}

export function NotAcceptableHttpException() {
  return {
    type: 'not_acceptable'
  }
}

export function NotFoundHttpException() {
  return {
    type: 'not_found'
  }
}

export function PreconditionFailedHttpException() {
  return {
    type: 'precondition_failed'
  }
}

export function PreconditionRequiredHttpException() {
  return {
    type: 'precondition_required'
  }
}

export function ServiceUnavailableHttpException() {
  return {
    type: 'service_unavailable'
  }
}

export function TooManyRequestsHttpException() {
  return {
    type: 'too_many_requests'
  }
}

export function UnauthorizedHttpException() {
  return {
    type: 'unauthorized'
  }
}

export function UnsupportedMediaTypeHttpException() {
  return {
    type: 'unsupported_media_type'
  }
}