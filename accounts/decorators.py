#Restricts view access by user roles - It checks if the logged-in user has one of the allowed roles
#before allowing them to access a view function.

from django.http import HttpResponseForbidden
from functools import wraps

def role_required(allowed_roles):
    """
    Decorator to restrict access to users with specific roles.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated and request.user.role in allowed_roles:
                return view_func(request, *args, **kwargs)
            return HttpResponseForbidden("You do not have permission to access this page.")
        return _wrapped_view
    return decorator
