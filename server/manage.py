#!/usr/bin/env python
"""Django's commands-line utility for administrative tasks."""
import sys
import os

sys.path.append('D:/UNIV/2024 2학기/Open Source Software/TermProject/oceanfish')
print("Current sys.path:")
print('\n'.join(sys.path))

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
